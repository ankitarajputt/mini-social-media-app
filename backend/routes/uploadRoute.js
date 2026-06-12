const router = require("express").Router();

const multer = require("multer");


// storage settings
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads");
    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


// upload image route
router.post("/", upload.single("image"), (req, res) => {

    res.json({
        imageUrl: req.file.filename
    });
});

module.exports = router;