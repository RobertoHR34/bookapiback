// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let bookSchema = require('../models/books');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    let newBook = request.body;

    if (!newBook.bookName || !newBook.authorsName || !newBook._id || !newBook.price){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    }else{
        let book = new bookSchema({
            bookName: newBook.bookName,
            authorsName: newBook.authorsName,
            _id: newBook._id,
            price: newBook.price,
        });

        book.save((error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": book.id});
            }
        });
    }
});

router.get('/', (request, response, next) => {
    let name = request.query['author'];
    if (name){
        bookSchema
            .find({"authorsName": name})
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }else{
        bookSchema
            .find()
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
});

router.get('/:id', (request, response, next) =>{
    bookSchema
        .findOne({"_id": request.params.id}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }
            if (result){
                response.send(result);
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});
router.patch('/:id', (request, response, next) =>{
    bookSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, friend)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(friend);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});

router.delete('/:id', (request, response, next) =>{
    bookSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params.id});
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});

module.exports = router;