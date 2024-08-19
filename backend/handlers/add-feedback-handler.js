const Book = require('../models/Book')
const averageRatingHandler = require('./average-rating-handler')

const addFeedbackHandler = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const userFeedbacks = book.ratings.filter(
                (el) => el.userId === req.body.userId
            )
            if (
                userFeedbacks.length !== 0 ||
                req.body.rating > 5 ||
                req.body.rating < 0
            ) {
                res.status(401).json(book)
            } else {
                const newAverageRating = averageRatingHandler(
                    book.ratings,
                    req.body.rating
                )
                Book.updateOne(
                    { _id: req.params.id },
                    {
                        $push: {
                            ratings: {
                                userId: req.body.userId,
                                grade: req.body.rating,
                            },
                        },
                        $set: {
                            averageRating: newAverageRating,
                        },
                    }
                )
                    .then(() => {
                        Book.findOne({ _id: req.params.id })
                            .then((updatedBook) => {
                                res.status(200).json(updatedBook)
                            })
                            .catch((error) => res.status(500).json({ error }))
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(404).json({ error })
        })
}

module.exports = addFeedbackHandler
