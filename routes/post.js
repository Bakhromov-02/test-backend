const express = require("express");
const router = express.Router();


const isAuth = require('../middleware/auth');
const postControllers = require('../controllers/post');

router.get("/posts", postControllers.getPosts);

router.get("/tags", isAuth, postControllers.getTags);

router.post("/create-post", isAuth, postControllers.createPost);

module.exports = router;
