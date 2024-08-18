exports.sortingBooks = (books) => {
    if (books.length < 3) {
        return books
    } else {
        const sortedBooks = books.sort((a, b) => {
            return a.averageRating - b.averageRating
        })
        const filteredBooks = sortedBooks.filter((el, idx) => idx <= 2)
        return filteredBooks
    }
}
