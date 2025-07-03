// app.js
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const lock = require("./middleware/authMiddleware"); // Import auth middleware
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
// app.js
const userRoutes = require("./routes/userroutes");
const chatRoutes = require("./routes/chatRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const appCardsRoutes = require("./routes/appCardRoutes");

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
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
app.use(cors());

app.use(convertDatesToLocalTime);

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   pingInterval: 25000,
// });

// io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const webBuildPath = path.join(__dirname, "web");
app.use(express.static(webBuildPath));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument, {
//     swaggerOptions: {
//       authAction: {
//         // Default token in the Authorization header
//         BearerAuth: {
//           name: "Authorization",
//           schema: {
//             type: "apiKey",
//             in: "header",
//             name: "Authorization",
//           },
//           value: `Bearer ${process.env.JWT_KEY}`,
//           // Replace with your default token
//         },
//       },
//     },
//   })
// );

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
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

// global.io = io;

// app.use((_req, res, _next) => {
//   res.sendFile(path.join(__dirname, "web", "index.html"));
// });

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   socket.on("disconnect", (reason) => {
//     console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
//   });
// });

// io.of("/namespace").on("connection", (socket) => {
//   console.log("User connected to namespace");
// });

// Error logging function
async function logErrorToExcel({
  date,
  url,
  statusCode,
  response,
  userId,
  username,
  userEmail,
  phoneNumber,
}) {
  const workbook = new ExcelJS.Workbook();
  const filePath = "./error_log.xlsx";
  const dateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  // Check if the file exists and read it
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
    const sheet = workbook.addWorksheet("Errors");

    // Define columns for the first time
    sheet.columns = [
      { header: "S.No", key: "s_no", width: 5 },
      { header: "Date & Time", key: "date", width: 20 },
      { header: "API URL", key: "url", width: 30 },
      { header: "Status Code", key: "statusCode", width: 10 },
      { header: "Response", key: "response", width: 30 },
      { header: "User ID", key: "userId", width: 10 },
      { header: "Name", key: "username", width: 20 },
      { header: "Email", key: "userEmail", width: 30 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
    ];
  }

  const sheet = workbook.getWorksheet("Errors");

  // Find the next row number
  const rowCount = sheet.rowCount + 1;

  // Add row with error data
  sheet.addRow({
    s_no: rowCount,
    date: dateTime,
    url,
    statusCode,
    response,
    userId,
    username,
    userEmail,
    phoneNumber,
  });

  // Write the updated workbook to the file
  await workbook.xlsx.writeFile(filePath);
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

      // Log the error to Excel
      await logErrorToExcel({
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

app.use("/api/e1/user", userRoutes);
app.use("/api/e1/chat", lock, chatRoutes);
app.use("/api/e1/order", lock, orderRoutes);
app.use("/api/e1/product", lock, productRoutes);
app.use("/api/e1/cart", lock, cartRoutes);
app.use("/api/e1/appcards", lock, appCardsRoutes);
app.use("/api/e1/payments", lock, paymentRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and synced".green);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.blue);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:".red, err);
  });
