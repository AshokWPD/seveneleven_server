const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = path.extname(file.originalname).toLowerCase();
    let folder = "assets/others"; // Default folder for unsupported types

    if ([".jpg", ".jpeg", ".png", ".gif"].includes(fileType)) {
      folder = "assets/images";
    } else if ([".pdf"].includes(fileType)) {
      folder = "assets/documents";
    } else if ([".doc", ".docx"].includes(fileType)) {
      folder = "assets/documents";
    } else if ([".mp4", ".mkv", ".avi"].includes(fileType)) {
      folder = "assets/videos";
    } else if ([".mp3", ".wav", ".aac"].includes(fileType)) {
      folder = "assets/audio";
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".pdf",
      ".doc",
      ".docx",
      ".mp4",
      ".mkv",
      ".avi",
      ".mp3",
      ".wav",
      ".aac",
    ];
    const fileType = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileType)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

// Handle file upload
exports.uploadFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate file URL
    const fileType = path.extname(req.file.originalname).toLowerCase();
    let baseFolder = "assets/others";

    if ([".jpg", ".jpeg", ".png", ".gif"].includes(fileType)) {
      baseFolder = "assets/images";
    } else if ([".pdf", ".doc", ".docx"].includes(fileType)) {
      baseFolder = "assets/documents";
    } else if ([".mp4", ".mkv", ".avi"].includes(fileType)) {
      baseFolder = "assets/videos";
    } else if ([".mp3", ".wav", ".aac"].includes(fileType)) {
      baseFolder = "assets/audio";
    }

    const fileUrl = `${baseFolder}/${req.file.filename}`;
    res.status(200).json({ fileUrl: fileUrl });
  });
};



exports.deleteImageByPath = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ message: "filePath is required" });
    }

    const fullPath = path.join(__dirname, "..", filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file
    fs.unlink(fullPath, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting file", error: err.message });
      }

      // Optional: Also delete the Image entry from DB if needed
      // await Image.destroy({ where: { file: filePath } });

      res.status(200).json({ message: "File deleted successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};