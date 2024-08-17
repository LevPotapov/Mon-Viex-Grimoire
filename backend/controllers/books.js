const fs = require('fs')
const Book = require('../models/Book')

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
            if (books.length > 3) {
                const sortedBooks = books.sort((a, b) => {
                    return a.averageRating - b.averageRating
                })
                const filteredBooks = sortedBooks.filter((el, idx) => idx <= 2)
                console.log(filteredBooks)
                res.status(200).json(filteredBooks)
            } else {
                res.status(200).json(books)
            }
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
            console.log(book)
            console.log(req.params)
            console.log(req.body)
            const userFeedbacks = book.ratings.filter(
                (el) => el.userId === req.params.id
            )
            if (userFeedbacks.length !== 0) {
                console.log(1)
                res.status(401).json({
                    message: 'You have already added a feedback.',
                })
            } else {
                console.log(2)
                const newRatings = [
                    ...book.ratings,
                    { userId: req.params.id, grade: req.body.rating },
                ]
                const newAverageRating =
                    (book.ratings.reduce((acc, el) => acc + el.grade, 0) +
                        req.body.rating) /
                    (book.ratings.length + 1)
                const filename = book.imageUrl.split('/images/')[1]
                console.log(newRatings, newAverageRating, filename)
                Book.updateOne(
                    { _id: req.params.id },
                    {
                        ...book,
                        _id: req.params.id,
                        ratings: newRatings,
                        averageRating: newAverageRating,
                    }
                )
                    .then((res) => {
                        console.log(res)
                    })
                    .catch((error) => res.status(500).json({ error }))
            }
        })
        .catch((error) => res.status(404).json({ error }))
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
