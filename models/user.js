const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email required']
    },
    password: { type: String, required: true, minlength: 5 },
}, { timestamps: true });


module.exports = User = mongoose.model('user', userSchema);
