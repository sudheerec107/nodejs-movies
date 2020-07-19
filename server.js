require('dotenv').config(); // to pick process.env properties from .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

// mongo connections
mongoose.connect(MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
        if (!err) {
            console.log('Mongodb connected successfully');
        } else {
            console.log('Failed to connect mongodb');
        }
    });

// api requests
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/',  express.static(__dirname + '/public'));

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`Server started on port: ${PORT}`);
    } else {
        console.log(`Unable to start aerver on port: ${PORT}`);
    }
});
