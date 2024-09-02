const express = require("express");
const dotenvConfig = require("./config/dotenvConfig");
dotenvConfig();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/workerRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", workerRoutes);
app.use("/api/v1", orderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running successfully`);
});
