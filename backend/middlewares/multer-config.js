const multer = require('multer')
const sharpMulter = require('sharp-multer')

const newFilenameFunction = (og_filename, options) => {
    let newname = og_filename.split(' ').join('_')
    newname = newname.split('.', 1)
    newname = newname + `${Date.now()}.${options.fileFormat}`
    return newname
}

const storage = sharpMulter({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    imageOptions: {
        fileFormat: 'webp',
        resize: {
            width: 500,
            height: 600,
        },
    },
    filename: newFilenameFunction,
})

module.exports = multer({ storage }).single('image')
