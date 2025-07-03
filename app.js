// app.js
const express = require("express");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();


const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");


const bodyParser = require("body-parser");
const sequelize = require("./config/db");
// const lock = require("./middleware/authMiddleware"); // Import auth middleware
const authorizeRoles = require("./middleware/roleAuth");

const models = require("./models/models");

const associateModels = require("./models/associateModels");
const updateSwaggerDescriptionWithTagCounts = require("./utils/swaggerCount");

// routes
const adminRoutes = require("./routes/adminroutes");
const userRoutes = require("./routes/userRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const userDetailRoutes = require("./routes/userDetailRoutes");
const userNotificationRoutes = require("./routes/notificationRoutes");
const helpTicketRoutes = require("./routes/helpTicketRoutes");
const commercialLinksRoutes = require("./routes/commercialLinkRoutes");
const authRoutes = require("./routes/platformAuth");

const assetUploadRoutes = require("./routes/assetUploadRoute");

const convertDatesToLocalTime = require("./middleware/dateTimelocal");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const http = require("http");
const redisAdapter = require("socket.io-redis"); // Import Redis Adapter for Socket.IO
const cors = require("cors");
const ExcelJS = require("exceljs");
require("dotenv").config();
require("colors");
const app = express();
const PORT = process.env.PORT || 4580;
const server = http.createServer(app);
app.use(cors());

app.use(convertDatesToLocalTime);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/e1/assets", express.static(path.join(__dirname, "assets")));

const webBuildPath = path.join(__dirname, "web");
app.use(express.static(webBuildPath));

app.use(bodyParser.json());

app.use(
  session({
    secret: "your_secret_key", // required by passport
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


(async () => {
  try {
    await models.User.sync({ force: false });
    await models.UserDetails.sync({ force: false });
    await models.Admin.sync({ force: false });
    await models.Banner.sync({ force: false });
    await models.Notification.sync({ force: false });
    await models.commercialLinks.sync({ force: false });
    await models.HelpTicket.sync({ force: false });

    associateModels();

    console.log("Database Connected successfully");
  } catch (error) {
    console.error("Error syncing User table:", error);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error logging function for .csv file
async function logErrorToCsv({
  date,
  url,
  statusCode,
  response,
  userId,
  username,
  userEmail,
  phoneNumber,
}) {
  const filePath = path.join(__dirname, "error_log.csv");
  const dateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  // Define the header for CSV and the new row with error details
  const header =
    "Date & Time,API URL,Status Code,Response,User ID,Name,Email,Phone Number\n";
  const errorDetails = `"${dateTime}","${url}","${statusCode}","${response}","${userId}","${username}","${userEmail}","${phoneNumber}"\n`;

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // If not, create the file and write the header
    fs.writeFileSync(filePath, header, "utf8");
  }

  // Append the error details as a new row
  fs.appendFileSync(filePath, errorDetails, "utf8");
  //console.log("Error logged to error_log.csv");
}

// Middleware for logging errors
app.use((req, res, next) => {
  res.on("finish", async () => {
    const statusCode = res.statusCode;

    // Log only if status code is not 200 or 201
    if (statusCode !== 200 && statusCode !== 201) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      let userId = "Unknown";
      let username = "Unknown";
      let userEmail = "Unknown";
      let phoneNumber = "Unknown";

      // Extract userId and username from token if available
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId;

          // Assuming you have a User model to get the username
          const user = await sequelize.models.User.findByPk(userId);
          username = user ? user.username : "Unknown";
          userEmail = user ? user.userEmail : "Unknown";
          phoneNumber = user ? user.phoneNumber : "Unknown";
        } catch (err) {
          console.error("Token verification failed:", err);
        }
      }

      await logErrorToCsv({
        date: new Date(),
        url: req.originalUrl,
        statusCode,
        response: res.statusMessage || "Error",
        userId,
        username,
        userEmail,
        phoneNumber,
      });
    }
  });
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  res.on("finish", () => {
    // Trigger logging when response is sent
    const statusCode = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;

    // Determine color based on status code
    const statusColor =
      statusCode === 200 || statusCode === 201 ? "green" : "red";
    console.log(`${method} ${url} - Status: ${statusCode}`[statusColor]);
  });
  next();
});

app.use("/api/e1/admin" /* #swagger.tags = ['Admin'] */, adminRoutes);
app.use("/api/e1/auth" /* #swagger.tags = ['Auth'] */, authRoutes);

app.use("/api/e1/user" /* #swagger.tags = ['User'] */, userRoutes);
app.use(
  "/api/e1/userDetails" /* #swagger.tags = ['UserDetails'] */,
  userDetailRoutes
);

app.use("/api/e1/banner" /* #swagger.tags = ['Banner'] */, bannerRoutes);

app.use(
  "/api/e1/assetsUpload" /* #swagger.tags = ['Image'] */,
  authorizeRoles(1, 2, 3),
  assetUploadRoutes
);

app.use(
  "/api/e1/notification" /* #swagger.tags = ['Notification'] */,
  userNotificationRoutes
);

app.use(
  "/api/e1/commercialLinks" /* #swagger.tags = ['Commercial Links'] */,
  commercialLinksRoutes
);
app.use(
  "/api/e1/helpTickets" /* #swagger.tags = ['Help Tickets'] */,
  helpTicketRoutes
);

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./api_doc.json");

updateSwaggerDescriptionWithTagCounts();

app.use(
  "/api/a1/apiDoc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      authAction: {
        BearerAuth: {
          name: "Authorization",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
          value: `Bearer ${process.env.JWT_KEY}`, // Set your default token here
        },
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.blue);
});
