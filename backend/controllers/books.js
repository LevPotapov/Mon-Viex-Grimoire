const fs = require('fs')
const Book = require('../models/Book')
const sortingBooks = require('../utils/sorting-books')
const averageRatingHandler = require('../utils/averageRating-handler')

exports.getAllBooks = (req, res) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            res.status(200).json(book)
        })
        .catch((error) => res.status(404).json({ error }))
}

exports.getBestRatingBooks = (req, res) => {
    Book.find()
        .then((books) => {
            const bestRatingBooks = sortingBooks(books)
            res.status(200).json(bestRatingBooks)
        })
        .catch((error) => res.status(400).json({ error }))
}

exports.addBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject.userId
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
        ratings: [],
        averageRating: 0,
    })
    book.save()
        .then(() =>
            res.status(201).json({ message: 'The object has been created.' })
        )
        .catch((error) => res.status(400).json({ error }))
}

exports.addFeedback = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const userFeedbacks = book.ratings.filter(
                (el) => el.userId === req.body.userId
            )
            console.log(req.auth.userId, req.body.userId, req.params.id)
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

exports.modifyBook = (req, res) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body }
    delete bookObject.userId
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized.' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.updateOne(
                        { _id: req.params.id },
                        { ...bookObject, _id: req.params.id }
                    )
                        .then(() => {
                            res.status(200).json({
                                message: 'The object has been created.',
                            })
                        })
                        .catch((error) => res.status(500).json({ error }))
                })
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'The object has been deleted.',
                            })
                        })
                        .catch((error) => res.status(401).json({ error }))
                })
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}
