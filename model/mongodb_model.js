const mongoose = require('mongoose');

function query(data,callback) {
    mongoose.connect('mongodb://' + data.host + '/' + data.database, {useNewUrlParser: true});

    let MongoClient = require('mongodb').MongoClient;
    let url = 'mongodb://' + data.host + '/';
    let db = mongoose.connection;
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        let dbo = db.db(data.database);
        dbo.collection(data.table).find(JSON.parse(data.query)).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result)
            callback(result);
        });
    });
}

module.exports = {
    query
}