const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id;

suite('Functional Tests', () => {

  suite('Routing tests', () => {

    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', done => {
        chai.request(server)
        .post('/api/books')
        .send({title: 'Title1'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.equal(res.body.title, 'Title1');
          assert.isArray(res.body.comments);
          id = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', done => {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing title');
          done();
        });
      });
    });


    suite('GET /api/books => array of books', () =>{
      
      test('Test GET /api/books',  done => {
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db',  done => {
        chai.request(server)
        .get('/api/books/111')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  done => {
        chai.request(server)
        .get('/api/books/' + id)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'comments');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.equal(res.body.title, 'Title1');
          assert.equal(res.body._id, id);
          assert.isArray(res.body.comments)
          done();
        });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', done => {
        chai.request(server)
        .post('/api/books/' + id)
        .send({comment: 'great book'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'comments');
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.isArray(res.body.comments);
          assert.include(res.body.comments, 'great book');
          done();
        });
      });
    });
  });
});
