const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./configs/mongodb"); // connecting mongodb here

app.use(express.json()); //middleware to parse json
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const authRoutes = require("./routers/auth.routes");
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running at " + port + "..."));
