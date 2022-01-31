const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');
const {createPostValidate} = require('../middleware/validation');
const {raw} = require("express");

exports.getTags = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        res.status(201).json({
            message: true,
            data: tags
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getPosts = async (req, res, next) => {
    try {

        const posts = await Post.find()
            .populate('creator')
            .sort({createdAt: -1})

        const postData = posts.map(post => {
            return {...post._doc, creator: post.creator.email}
        })
        res.status(200).json({
            success: true,
            data: postData,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const userId = req.body.userId;

    const {error} = await createPostValidate(req.body);
    if (error) {
        return res
            .status(400)
            .json({success: false, error: error.details[0].message});
    }

    const post = new Post({
        title: title,
        content: content,
        tags: tags,
        creator: userId
    });
    // "userId": "61f6870d723781edd1b774ef"
    try {
        await post.save();
        const user = await User.findById(req.userId);
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: {_id: user._id, name: user.name}
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}