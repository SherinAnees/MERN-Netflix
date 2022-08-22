const express = require("express");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const dotenv = require("dotenv").config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/movies", require("./routes/moviesRoutes"));
app.use("/api/list", require("./routes/listRoutes"));
app.listen(5000, () => {
  console.log("server is running port 5000");
});
