const fs = require('fs')
const Book = require('../models/Book')
const sortingBooksHandler = require('../handlers/sorting-books-handler')
const addFeedbackHandler = require('../handlers/add-feedback-handler')
const updateBookHandler = require('../handlers/update-book-handler')

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
            const bestRatingBooks = sortingBooksHandler(books)
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
    addFeedbackHandler(req, res)
}

exports.modifyBook = (req, res) => {
    updateBookHandler(req, res)
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
