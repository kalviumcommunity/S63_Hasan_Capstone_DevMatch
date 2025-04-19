const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected Successfully!"))
.catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Import route files
const userRouter = require("./routes/userRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const uploadRouter = require("./routes/uploadRouter");
const authRouter = require("./routes/auth");

// Use routers
app.use("/api/requests", requestRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/users", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to DevMatch');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
