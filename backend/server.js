const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// =======================
// ROUTES IMPORT
// =======================
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoute = require("./routes/uploadRoute");


// =======================
// ROUTES USE
// =======================
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoute);


// =======================
// DATABASE CONNECTION
// =======================
mongoose.connect("mongodb://ankitaarajput88_db_user:Adarsh123@ac-c9w7l8h-shard-00-00.fhlbhuf.mongodb.net:27017,ac-c9w7l8h-shard-00-01.fhlbhuf.mongodb.net:27017,ac-c9w7l8h-shard-00-02.fhlbhuf.mongodb.net:27017/?ssl=true&replicaSet=atlas-2i86n5-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:",err));


// =======================
// SERVER START
// =======================
app.listen(5000, () => {
    console.log("Server running on port 5000");
});