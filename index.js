// const express = require("express");
// const cors = require("cors");
// const app = express();

// require("dotenv").config();
// require("./configs/mongodb"); // connecting mongodb here

// app.use(express.json()); //middleware to parse json
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "*" }));

// const authRoutes = require("./routers/auth.routes");
// const imageUpload = require("./routers/imageUpload.route")
// app.use("/api/auth", authRoutes);
// app.use("/api/images",imageUpload)
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log("Server running at " + port + "..."));
const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./configs/mongodb"); // connecting mongodb here

app.use(express.json()); // middleware to parse json
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Import routes
const authRoutes = require("./routers/auth.routes");
// const imageUpload = require("./routers/imageUpload.route");
const userRoutes = require("./routers/user.routes"); // Add this line
const friendRequestRoutes = require("./routers/friendRequest.routes");
const chatRoutes = require("./routers/chat.routes");
// Mount routes
app.use("/api/auth", authRoutes);
// app.use("/api/images", imageUpload);
app.use("/api/users", userRoutes); // Add this line
app.use("/api/friendRequest", friendRequestRoutes);
app.use("/api/chat", chatRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running at " + port + "..."));
