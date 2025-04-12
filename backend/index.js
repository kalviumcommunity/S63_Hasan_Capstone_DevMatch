const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// Import route files
const userRouter = require("./routes/userRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");

// Use routers
app.use("/api/users", userRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/requests", requestRouter);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to DevMatch');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
