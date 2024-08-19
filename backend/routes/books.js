const express = require('express')
const authorization = require('../middlewares/authorization')
const booksCtrl = require('../controllers/books')
const multer = require('../middlewares/multer-config')

const router = express.Router()

router.get('/', booksCtrl.getAllBooks)

router.get('/bestrating', booksCtrl.getBestRatingBooks)

router.get('/:id', booksCtrl.getOneBook)

router.post('/', authorization, multer, booksCtrl.addBook)

router.post('/:id/rating', authorization, booksCtrl.addFeedback)

router.put('/:id', authorization, multer, booksCtrl.modifyBook)

router.delete('/:id', authorization, multer, booksCtrl.deleteBook)

module.exports = router
