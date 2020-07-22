const router = require('express').Router();
const Movie = require('../models/movie');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const writelog = require('writelog');
const errorHandler = require('../utils/utils');

// just to show we can use group as well not used in UI
router.get('/group', auth, (req, res) => {
    Movie.aggregate([
        {
            $group: {
                _id: {
                    "$group": "$category",
                    "title": "$title"
                }
            }
        }
    ], (error, movies) => {
        if (!error) {
            res.json(movies);
        } else {
            writelog('error', error);
            res.status(400).json({ msg: 'Unable to find movies' })
        }
    });

}, errorHandler);

router.post('/', auth,
    [
        body('title').notEmpty(),
        body('year').notEmpty(),
        body('rating').notEmpty(),
        body('director').notEmpty(),
        body('description').notEmpty(),
        body('cast').isLength({ min: 1 })
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            writelog('error', error.errors);
            res.status(500).json({ msg: `Invalid ${error.errors[0].param} input` })
        } else {
            const newMovie = new Movie({
                ...req.body
            });
            const savedMovie = await newMovie.save();
            res.json(savedMovie);
        }
    }, errorHandler);

router.put('/:id', auth,
    [
        body('title').notEmpty(),
        body('year').notEmpty(),
        body('director').notEmpty(),
        body('description').notEmpty(),
        body('cast').isLength({ min: 1 })
    ],
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            writelog('error', error.errors);
            res.status(500).json({ msg: `Invalid ${error.errors[0].param} input` })
        } else {
            var movie = await Movie.findById(req.params.id).exec();
            movie.set(req.body);
            var result = await movie.save();
            res.send(result);
        }
    }, errorHandler);

router.get('/', auth,
    async (req, res) => {
        const movies = await Movie.find();
        res.json(movies);
    }, errorHandler);

router.get('/:id', auth,
    async (req, res) => {
        Movie.findById(req.params.id, (error, movie) => {
            if (!error) {
                res.json(movie);
            } else {
                res.status(400).json({ msg: 'Invalid input' });
            }
        });
    }, errorHandler);

module.exports = router;
