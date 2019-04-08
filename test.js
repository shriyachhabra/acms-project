const cli=require('./queryES');
const clientMONGO=require('./mongo')
var m={"query": {"match": {"name": "Jobat"}}}
// var res;
// cli.search(m);
//
// setTimeout(function () {
//     res=cli.resES()
//     console.log(res)
// },500)


var query = "{ \"ticker\": \"IBM\" }";
query=JSON.parse(query)

// clientMONGO.search(query)
// setTimeout(function () {
//     console.log(clientMONGO.resMONGO())
// // },200)


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url,{useNewUrlParser: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("sample");
    dbo.collection("test").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

var data={
    "header":"ACMS DASHBOARD",
    "components":[
        {"id":1,
            "type":"graph",
            "x-val":"lat",
            "y-val":"lng",
            "position":1,
            "query":"{\"query\": {\"match\": {\"name\": \"Jobat\"}}}",
            "datasource":"1"},
        {"id":2,
            "type":"bar",
            "x-val":"value",
            "y-val":"value",
            "position":2,
            "query":"{ \"ticker\": \"IBM\" }",
            "datasource":"2"}]}
var a="",arr=[]
//var p=cli.search(m);




