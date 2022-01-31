const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 255,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        maxlength: 255,
        minlength: 6,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model('User', userSchema);