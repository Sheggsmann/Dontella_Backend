const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const dbConnection = require("./db");
const logging = require("./logging");
const error = require("./middlewares/error");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const edibleRoutes = require("./routes/edibles");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const statRoutes = require("./routes/stats");

dotenv.config({});

logging();
dbConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(helmet());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/edibles", edibleRoutes);
app.use("/stats", statRoutes);
app.use(error);

const PORT = process.env.PORT || 8800;

let server = null;
if (process.env.NODE_ENV === "development") {
  server = app.listen(PORT, () => {
    console.log(`[SERVER RUNNING ON PORT ${PORT}]`);
  });
} else {
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT:${PORT}`);
  });
}

module.exports = server;
