const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sample');

var db = mongoose.connection;
db.once('open', function () {
    console.log('Connection has been made');


     var cursor = db.collection('test').find();

     cursor.each(function (err, doc) {

         console.log(JSON.stringify(doc));

     });
     var cname = 'test';
     var query = { ticker: "IBM" };
     var ab = db.collection(cname).find(query);
     ab.each(function (err, doc) {

         console.log(JSON.stringify(doc));

     });

}).on('error', function (error) {
    console.log('Connection error', error);
});

// var docs = [{ _id: 1, value: 1, ticker: 'IBM' },
//     { _id: 2, value: 1, ticker: 'AAPL' },
//     { _id: 3, value: 1, ticker: 'INTC' },
//     { _id: 4, value: 1, ticker: 'FFIV' },
//     { _id: 5, value: 1, ticker: 'ARRS' }];


// db.collection('test').insertMany(docs, function (error, inserted) {
// if (error) {
// console.error(error);
// }
// else {
// console.log("Successfully inserted: ", inserted);
// }
//
// }); // end of insert
