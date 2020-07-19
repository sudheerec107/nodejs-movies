const router = require('express').Router();
const Movie = require('../models/movie');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

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
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                res.status(500).json({ msg: `Invalid ${error.errors[0].param} input` })
            } else {
                const newMovie = new Movie({
                    ...req.body
                });
                const savedMovie = await newMovie.save();
                res.json(savedMovie);
            }

        } catch (error) {
            res.status(500).json({ msg: 'Internal server Error' });
        }
    });

router.put('/:id', auth,
    [
        body('title').notEmpty(),
        body('year').notEmpty(),
        body('director').notEmpty(),
        body('description').notEmpty(),
        body('cast').isLength({ min: 1 })
    ],
    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                res.status(500).json({ msg: `Invalid ${error.errors[0].param} input` })
            } else {
                var movie = await Movie.findById(req.params.id).exec();
                movie.set(req.body);
                var result = await movie.save();
                res.send(result);
            }
        } catch (error) {
            res.status(500).json({ msg: 'Internal server Error' });
        }
    });

router.get('/', auth,
    async (req, res) => {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            res.status(500).json({ msg: 'Internal server Error' });
        }
    });

router.get('/:id', auth,
    async (req, res) => {
        try {
            Movie.findById(req.params.id, (error, movie) => {
                if (!error) {
                    res.json(movie);
                } else {
                    res.status(400).json({ msg: 'Invalid input' });
                }
            });
        } catch (error) {
            res.status(500).json({ msg: 'Internal server Error' });
        }
    });

module.exports = router;
