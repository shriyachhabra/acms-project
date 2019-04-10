const express = require('express');
const bp = require('body-parser');
// const clientES=require('./queryES');
// const clientMONGO=require('./mongo')
const sql_db = require('./database');
const session = require('express-session');
const path=require('path');
const fs = require('fs');
const app=express();



const elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: ['http://127.0.0.1:9200']
});


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sample',{useNewUrlParser: true});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";





var db = mongoose.connection;
var cname = 'test';
var query = { ticker: "IBM" };
var ans="d";





var sourceId,queryReceived;
var map={};
var es="1",md="2",sql="3";
var queryArr=[];
var m=[];


//const content = fs.readFileSync("data.json");

const new_content = fs.readFileSync("new.json");

app.use('/', express.static(__dirname + "/"));

app.use(bp.urlencoded({extended: true}))
app.use(bp.json())


app.get('/',(req,res)=>{
    res.sendFile('index.html');

})

app.get('/dashboard',(req,res)=>{
    res.send(map)
    res.sendFile('dashboard.html');

})



//retrieve no of dashboard
app.post('/fetch_dashboard',(req,res)=>{
    sql_db.getDashboard(req.body).then(function (data) {
        console.log('success dashboard');
        res.send({success:true,data:data});
        //console.log(data);
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
})
var content;
//dashboard click
app.post('/dashboard_click',(req,res)=>{
   // console.log(req.body.id);
    //var content = req.body;
    sql_db.getQuery(req.body).then(function (data) {
        console.log('success');
        res.send({success: true,data:data})
        content=data.query;
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
})


//retrieve query from dashboard
app.get('/editbutton',(req,res)=>{
    res.send({data:content});
    console.log(content);
})



app.get('/new_content',(req,res)=>{
    res.contentType('json');
    res.send(JSON.parse(new_content));
})


//Add a new user
app.post('/do', (req, res) => {
    sql_db.addDo(req.body).then(function () {
    	console.log('success registration');
    	res.send({success: true})
    }).catch(function (err) {
    	console.log('Error'+err);
        throw err;
    })
});


//Match user
app.post('/login', (req, res) => {
    sql_db.getLogin(req.body).then(function (data) {
        console.log('success login');
        res.send({success:true,data:data});
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
});


//store query in dashboard
app.post('/new_content',(req,res)=>{
    sql_db.addQuery(req.body).then(function (data) {
        console.log('success query');
        res.send({success: true,data:data})
        //console.log(data)
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
});


app.post('/editbutton',(req,res)=>{
    const components=req.body.comp;

    //fs.writeFileSync("data.json",req.body.data);
    //console.log(req.body.data);
    //console.log(components);
    //console.log(JSON.stringify(components[0]));
   // console.log(components[0].id);
    //console.log(components.length);



    for(let i=0;i<components.length;i++){

        sourceId=components[i].datasource;
        queryReceived=components[i].query;

        if(sourceId==="1") {

            client.search(
                {
                    index: 'tutorial',
                    body: queryReceived,
                    type: 'cities_list'
                })
                .then(results => {
                    // console.log(results.hits.hits)
                    console.log(`found ${results.hits.total} items in ${results.took}ms`);
                    // set the results to the result array we have

                    var p = results.hits.hits;
                    //console.log("hi  "+JSON.stringify(p[0]["_source"]));
                    //console.log(p)
                   // queryArr.push(p)
                    var arr=[]
                    for(var ele=0;ele<p.length;ele++){
                        var obj=p[ele]["_source"]
                        arr.push(obj)
                    }
                    //console.log(arr)
                    map[components[i]['id']]=arr
                   // console.log(map)
                })
                .catch(err => {
                    console.log(err)
                });
        }else if(sourceId==="2"){

               //  console.log(typeof queryReceived);
                // console.log(typeof query)

            MongoClient.connect(url,{useNewUrlParser: true},function(err, db) {
                if (err) throw err;
                var dbo = db.db("sample");
                dbo.collection("test").find(JSON.parse(queryReceived)).toArray(function(err, result) {
                    if (err) throw err;
                    //console.log(queryReceived)
                   // console.log(result);
                    map[components[i]['id']]=result
                   // console.log(map)
                    db.close();
                });
            });


        }



    }

setTimeout(function () {
    console.log(map)
    res.send(map)
},2000)

});

/*app.post('/dashboard',(req,res)=>{

  console.log("inside dash")
    //console.log(req.body.map)
    //res.sendFile("dashboard.html")

});*/

// app.get('/test',function (req,res) {
//     res.contentType('json');
//     res.send(JSON.parse(content));
// });
//
// app.post('/change',function (req,res) {
//     console.log(req.body.result);
//     fs.writeFileSync("data.json",req.body.result);
// });

app.listen(7852, function () {
    console.log("Server started on http://localhost:7852");
});