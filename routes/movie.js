const router = require('express').Router();
const Movie = require('../models/movie');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const writelog = require('writelog');

router.get('/search', auth, (req, res) => {
    try {
    const searchText = req.query.title;
    Movie.find({ "title": { "$regex": searchText, "$options": "i" } },
        (err, movies) => {
            if (!err) {
                res.json(movies);
            } else {
                writelog('error', err);
                req.status(400).json({msg: 'Unable to search'})
            }
        });
    } catch (error) {
        writelog('catch error', error);
        res.status(500).json({ msg: 'Internal server Error' });
    }
});

// just to show we can use group as well not used in UI
router.get('/group', auth, (req, res) => {
    try {
    Movie.aggregate([
        {
        $group:  {
        _id: { 
                    "group": "$category", 
                    "title": "$title" 
                }
            }
        }
            ], (error, movies) => {
                if (!error) {
                    res.json(movies);
                } else {
                    writelog('error', error);
                    req.status(400).json({msg: 'Unable to find movies'})
                }
            });

    } catch (error) {
        writelog('catch error', error);
        res.status(500).json({ msg: 'Internal server Error' });
    }
});

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
                writelog('error', error.errors);
                res.status(500).json({ msg: `Invalid ${error.errors[0].param} input` })
            } else {
                const newMovie = new Movie({
                    ...req.body
                });
                const savedMovie = await newMovie.save();
                res.json(savedMovie);
            }

        } catch (error) {
            writelog('catch error', error);
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
                writelog('error', error.errors);
                res.status(500).json({ msg: `Invalid ${error.errors[0].param} input` })
            } else {
                var movie = await Movie.findById(req.params.id).exec();
                movie.set(req.body);
                var result = await movie.save();
                res.send(result);
            }
        } catch (error) {
            writelog('catch error', error);
            res.status(500).json({ msg: 'Internal server Error' });
        }
    });

router.get('/', auth,
    async (req, res) => {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            writelog('catch error', error);
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
            writelog('catch error', error);
            res.status(500).json({ msg: 'Internal server Error' });
        }
    });

module.exports = router;
