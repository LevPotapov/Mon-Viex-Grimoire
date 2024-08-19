const fs = require('fs')
const Book = require('../models/Book')

const updateBookHandler = (req, res) => {
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
                req.file
                    ? fs.unlink(`images/${filename}`, () => {
                          Book.updateOne(
                              { _id: req.params.id },
                              { ...bookObject, _id: req.params.id }
                          )
                              .then(() => {
                                  res.status(200).json({
                                      message:
                                          'The object has been successfully changed.',
                                  })
                              })
                              .catch((error) => res.status(500).json({ error }))
                      })
                    : Book.updateOne(
                          { _id: req.params.id },
                          { ...bookObject, _id: req.params.id }
                      )
                          .then(() => {
                              res.status(200).json({
                                  message:
                                      'The object has been successfully changed.',
                              })
                          })
                          .catch((error) => res.status(500).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

module.exports = updateBookHandler
