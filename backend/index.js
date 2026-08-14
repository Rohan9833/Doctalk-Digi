const express = require("express");
const connectDB = require("./db/dbConnect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const authRoutes = require("./Route/Authroutes");
const adminRoutes = require("./Route/AdminRoute");
const clientRoutes = require("./Route/Clientroutes");
const campaignRoutes = require("./Route/Campaignroutes");
const doctorRoutes = require("./Route/Doctorroutes");
const quizRoutes = require("./Route/Quizroutes");
const quizAttemptRoutes = require("./Route/Quizattemptroutes");
const analyticsRoutes = require("./Route/Analyticsroutes");
const QrcodeRoutes = require("./Route/QrcodeRoutes");
const mrRoutes = require("./Route/MrRoute");
const UserRoutes = require("./Route/UserRoute.js");
const {trackQrScan} = require("./Controller/Qrcodecontroller.js")


connectDB();

app.use(cors({
  origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://duplex-slate-kilobyte.ngrok-free.dev",
    ],
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", quizAttemptRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/qrcode", QrcodeRoutes);
app.use("/api/mr", mrRoutes);
app.use("/api/user", UserRoutes);

app.get("/q/:shortCode", trackQrScan);
app.get("/", (req, res) => {
  res.send("Welcome to the Doctalk Admin API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0" ,() => {
  console.log(`Server is running on port ${PORT}`);
});