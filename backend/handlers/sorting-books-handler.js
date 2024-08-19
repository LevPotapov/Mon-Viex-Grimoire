const sortingBooks = (books) => {
    if (books.length < 3) {
        return books
    } else {
        const sortedBooks = books.sort((a, b) => {
            return b.averageRating - a.averageRating
        })
        const filteredBooks = sortedBooks.filter((el, idx) => idx <= 2)
        return filteredBooks
    }
}

module.exports = sortingBooks
