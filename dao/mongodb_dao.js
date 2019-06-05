const mongoose = require('mongoose');
function query(data,callback) {
    mongoose.connect('mongodb://' + data.host + '/' + data.database, {useNewUrlParser: true});

    let MongoClient = require('mongodb').MongoClient;
    let url = 'mongodb://' + data.host + '/';
    let db = mongoose.connection;
    if(data.name==="_id"){
        console.log(data);
        let ObjectId = require('mongoose').Types.ObjectId;
        let query = {_id:new ObjectId(data.query)};
        MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
            if (err) throw err;
            let dbo = db.db(data.database);
            dbo.collection(data.table).find(query).toArray(function (err,results) {
                if (err) throw err;
                console.log(results);
                callback(results);
            });
        });
    }else {
        MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
            if (err) throw err;
            let dbo = db.db(data.database);
            dbo.collection(data.table).find(JSON.parse(data.query)).toArray(function (err, result) {
                if (err) throw err;
                callback(result);
            });
        });
    }
}

module.exports = {
    query
};