const mongoose = require("mongoose");
require("dotenv").config();

exports.conncet = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((error) => {
        console.log("DB CONNECTION FAILED");
        console.error(error);
        process.exit(1);
    })
}; 