const averageRatingHandler = (allRatings, newReview) => {
    if (allRatings.length === 0) {
        return newReview
    }

    return (
        (allRatings.reduce((acc, el) => acc + el.grade, 0) + newReview) /
        (allRatings.length + 1)
    )
}

module.exports = averageRatingHandler
