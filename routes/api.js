'use strict';

const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB;
mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});

const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: String,
  comments: Array
});

module.exports = app => {

  app.route('/api/books')
    
    .get((req, res) => {
      const Book = mongoose.model('Book', BookSchema);
      Book.find({}, (error, data) => {
        if (error) return error;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({});
          arr[i]._id = data[i]._id;
          arr[i].title = data[i].title;
          arr[i].commentcount = data[i].comments.length;
        }
        res.json(arr);
      });
    })
    
    .post((req, res) => {
      const title = req.body.title;
      if (!title) {
        res.send('missing title');
      } else {
        const Book = mongoose.model('Book', BookSchema);
        const obj = {
          title: title,
          comments: []
        };
        const book = new Book(obj);
        book.save((err, data) => {
          if (err) return err;
          obj._id = data._id;
          res.json(obj);
        });
      }
    })
    
    .delete((req, res) => {
      const Book = mongoose.model('Book', BookSchema); 
      Book.remove({}, (error, data) => {
        if (error) {
          return error;
        } else {
          res.send('complete delete successful');
        }
      })
    });



  app.route('/api/books/:id')
    
    .get((req, res) => {
      const bookid = req.params.id;
      const Book = mongoose.model('Book', BookSchema);
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        res.send('no book exists');
        return; 
      }
      Book.find({_id: bookid}, (error, data) => {
        if (error) return error;
        if (data.length === 0) {
          res.send('no book exists');
          return;
        } 
        const obj = {
          _id: data[0]._id,
          title: data[0].title,
          comments: data[0].comments 
        };
        res.json(obj);
      });
    })
    
    .post((req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;
      const Book = mongoose.model('Book', BookSchema); 
      Book.find({_id: bookid}, (error, data) => {
        if (error) return error;
        data[0].comments.push(comment);
        const book = new Book(data[0]);
        book.save((err, data) => {
          if (err) return err;
          res.json(data);
        });
      });
    })
    
    .delete((req, res) => {
      const bookid = req.params.id;
      const Book = mongoose.model('Book', BookSchema); 
      Book.findOneAndDelete({_id: bookid}, (error, data) => {
        if (error) {
          return error;
        } else {
          res.send('delete successful');
        }
      })
    });
};
