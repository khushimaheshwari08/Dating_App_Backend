const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./configs/mongodb"); // connecting mongodb here

app.use(express.json()); //middleware to parse json
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const authRoutes = require("./routers/auth.routes");
const imageUpload = require("./routers/imageUpload.route")
app.use("/api/auth", authRoutes);
app.use("/api/images",imageUpload)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running at " + port + "..."));
