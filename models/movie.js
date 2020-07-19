const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    cast: {
        type: [String],
        required: true,
        minlength: 1
    },
    movieLength: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = User = mongoose.model('movie', movieSchema);
