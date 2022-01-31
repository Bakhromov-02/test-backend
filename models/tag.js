const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
        minLength: 3,
        maxLength: 15,
    }
});

module.exports = mongoose.model('Tag', tagSchema);