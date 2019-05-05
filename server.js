const express = require('express');
const bp = require('body-parser');
// const clientES=require('./queryES');
// const clientMONGO=require('./mongo')
const sql_db = require('./database');
const session = require('express-session');
const path=require('path');
const fs = require('fs');
const app=express();



/*const elasticsearch = require('elasticsearch');
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
*/




var sourceId,queryReceived,databaseReceived,tableReceived;
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
    res.send(map);
    res.sendFile('dashboard.html');


})


app.post('/dashboard',(req,res)=>{
    //sql_db.getLastDashboard(req.body).then(function () {
        //console.log(data.title);
        //res.send({succes:true, data:data});
        sql_db.getQuery(req.body).then(function (data) {
            console.log('success');
            res.send({success: true,data:data})
            content=data.query;
        }).catch(function (err) {
            console.log('Error'+err);
            throw err;
        })

    /*}).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })*/
})


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

app.post('/dashboard_click',(req,res)=>{
   // console.log(req.body.id);
    //var content = req.body;
    sql_db.addSession(req.body).then(function () {
        console.log('success add session');
        //res.send('success');
        sql_db.getQuery(req.body).then(function (data) {
            console.log('success');
            res.send({success: true,data:data})
            content=data.query;
        }).catch(function (err) {
            console.log('Error'+err);
            throw err;
        })
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })


});



app.get('/editbutton',(req,res)=>{
    res.send({data:content});
});



app.get('/new_content',(req,res)=>{
    res.contentType('json');
    res.send(JSON.parse(new_content));
});



app.post('/do', (req, res) => {
    sql_db.addDo(req.body).then(function () {
    	console.log('success registration');
    	res.send({success: true})
    }).catch(function (err) {
    	console.log('Error'+err);
        throw err;
    })
});



app.post('/login', (req, res) => {
    sql_db.getLogin(req.body).then(function (data) {
        console.log('success login');
        res.send({success:true,data:data});
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
});



app.post('/new_content',(req,res)=>{

    sql_db.addQuery(req.body).then(function (data) {
        console.log('success query');
        res.send({success: true,data:data})
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })

});





app.post('/editbutton',(req,res)=>{
    const components=req.body.comp;
    const email = req.body.Email;
    var data;
    sql_db.updateQuery(req.body).then(function (data) {
        console.log('success update query');
        data=data;
        //console.log(data)
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    });

    //fs.writeFileSync("data.json",req.body.data);
    //console.log(req.body.data);
    //console.log(components);
    //console.log(JSON.stringify(components[0]));
   // console.log(components[0].id);
    //console.log(components.length);



    for(let i=0;i<components.length;i++){

        sourceId=components[i].datasource;
        queryReceived=components[i].query;
        databaseReceived = components[i].database;
        tableReceived = components[i].table;
        var data_body = {
            Email: email,
            Data_source: sourceId,
            Database: databaseReceived,
            Table: tableReceived
        };
        sql_db.getDataSource(data_body).then(function (data) {

            //console.log(data);
            if(data==="null"){
                console.log("null");
            }
            else if(data.data_source_name==="1") {
                const elasticsearch = require('elasticsearch');
                var client = new elasticsearch.Client({
                    hosts: data.host
                });
                client.search(
                    {
                        index: databaseReceived,
                        body: queryReceived,
                        type: tableReceived
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
            }else if(data.data_source_name==="2"){

                //  console.log(typeof queryReceived);
                // console.log(typeof query)

               /* const mongoose = require('mongoose');

                mongoose.connect('mongodb://localhost:27017/sample',{useNewUrlParser: true});

                var MongoClient = require('mongodb').MongoClient;
                var url = "mongodb://localhost:27017/";


                console.log('mongodb://'+data.host+'/'+databaseReceived);


                var db = mongoose.connection;*/

                const mongoose = require('mongoose');

                mongoose.connect('mongodb://'+data.host+'/'+databaseReceived,{useNewUrlParser: true});

                var MongoClient = require('mongodb').MongoClient;
                var url = 'mongodb://'+data.host+'/';
                var db = mongoose.connection;


                //console.log(queryReceived);

                MongoClient.connect(url,{useNewUrlParser: true},function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(databaseReceived);
                    dbo.collection(tableReceived).find(JSON.parse(queryReceived)).toArray(function(err, result) {
                        if (err) throw err;
                        //console.log(queryReceived)
                        // console.log(result);
                        map[components[i]['id']]=result
                        //console.log(map)
                        db.close();
                    });
                });


            }



    }).catch(function (err){
            console.log('Error'+err);
            throw err;
        });

    }

    setTimeout(function () {
        console.log(map)
        res.send({success: true,data:data,map:map})
    },2000)
});


//datasource table storing

app.post('/datasource',(req,res)=>{
    const components=req.body.comp;
    var data;
    sql_db.addDataSource(req.body).then(function (data) {
        console.log('successfull inserted');
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    });

    //fs.writeFileSync("data.json",req.body.data);
    //console.log(req.body.data);
    //console.log(components);
    //console.log(JSON.stringify(components[0]));
    // console.log(components[0].id);
    //console.log(components.length);



   /* for(let i=0;i<components.length;i++){

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
        res.send({success: true,data:data,map:map})
    },2000)*/

});

//datasource table fetching

/*app.get('/datasource',(req,res)=> {
    const components = req.body.comp;
    var data;
    sql_db.getDataSource(req.body).then(function (data) {
        console.log('success update query');
        res.send({data: content});
    }).catch(function (err) {
        console.log('Error' + err);
        throw err;
    });
});*/


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