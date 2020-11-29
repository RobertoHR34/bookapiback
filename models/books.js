const mongoose = require('mongoose');

let Schema = mongoose.Schema;

// The ISBN is the id string
let booksSchema = new Schema({
    bookName: String,
    authorsName: String,
    _id: String,
    price: Number,

});

module.exports = mongoose.model('books', booksSchema);