const mongoose = require('mongoose');
var query = { ticker: 'IBM' };
mongoose.connect('mongodb://localhost:27017/sample',{useNewUrlParser: true});

var db = mongoose.connection;
var cname = 'test';

var ans="d";
var p=0
// function search(query) {

db.once('open', function () {
        console.log('Connection has been made');

      db.collection(cname).find(query).toArray(function (err, res) {
             ans=res;
          console.log(ans)
        });


    }).on('error', function (error) {
        console.log('Connection error', error);
    });
console.log(p)

// }




//for printing all values
// var cursor = db.collection('test').find();
//
// cursor.each(function (err, doc) {
//
//     console.log(JSON.stringify(doc));
//
// });


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


// setTimeout(function () {
//     console.log(ans)
// },200)

function resMONGO(){

    return ans;
}


// module.exports={
//      search,resMONGO
//  }
