const router = require("express").Router();
const Post = require("../models/Post");


// =======================
// CREATE POST
// =======================

router.post("/create", async (req, res) => {

    try {

        const newPost = new Post(req.body);

        await newPost.save();

        res.json({
            message: "Post created"
        });

    } catch (err) {

        res.status(500).json(err);
    }
});


// =======================
// GET ALL POSTS
// =======================

router.get("/all", async (req, res) => {

    try {

        const posts = await Post.find().sort({ createdAt: -1 });

        res.json(posts);

    } catch (err) {

        res.status(500).json(err);
    }
});


// =======================
// LIKE / UNLIKE POST
// =======================

router.put("/:id/like", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.likes.includes(req.body.userId)) {

            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            });

            res.json({
                message: "Post unliked"
            });

        } else {

            await post.updateOne({
                $push: {
                    likes: req.body.userId
                }
            });

            res.json({
                message: "Post liked"
            });
        }

    } catch (error) {

        res.status(500).json(error);
    }
});


// =======================
// COMMENT ON POST
// =======================

router.put("/:id/comment", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        await post.updateOne({

            $push: {

                comments: {

                    userId: req.body.userId,

                    text: req.body.text
                }
            }
        });

        res.json({
            message: "Comment added"
        });

    } catch (error) {

        res.status(500).json(error);
    }
});
// =======================
// DELETE POST
// =======================

router.delete("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        // only owner can delete
        if (post.userId === req.body.userId) {

            await post.deleteOne();

            res.json({
                message: "Post deleted"
            });

        } else {

            res.status(403).json({
                message: "You can delete only your posts"
            });
        }

    } catch (error) {

        res.status(500).json(error);
    }
});

// EDIT POST
// =======================
// EDIT POST
// =======================

router.put("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        // only owner can edit
        if (post.userId === req.body.userId) {

            await post.updateOne({
                $set: {
                    description: req.body.description
                }
            });

            res.json({
                message: "Post updated"
            });

        } else {

            res.status(403).json({
                message: "You can edit only your posts"
            });
        }

    } catch (error) {

        res.status(500).json(error);
    }
});

// =======================
// EXPORT ROUTER
// =======================

module.exports = router;