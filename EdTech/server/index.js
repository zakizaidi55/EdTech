const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("./config/cloudinaryConnect");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");


dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect
database.conncet();
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"https://localhost:3000",
        credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinary connections
cloudinary.cloudinaryConnect();

// routes mount
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


// default route

app.get("/", (req, res) => {
    return res.status({
        success:true,
        message:"your server is up and running",
    })
})


// activate the server
app.listen(PORT, () => {
    console.log(`APP is runnig at port ${PORT}`)
}) 