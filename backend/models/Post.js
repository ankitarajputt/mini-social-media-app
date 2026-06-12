const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    userId: String,

    description: String,

    image: String,

    likes: {
        type: [String],
        default: []
    },

    comments: [
        {
            userId: String,
            text: String
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);