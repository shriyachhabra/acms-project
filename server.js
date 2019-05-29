const express = require('express');
const bp = require('body-parser');
const database_dao = require('./model/database_model');
const path=require('path');
const fs = require('fs');
const app=express();
let query_result_map={};
let dataSource_Map={};
let query_content;
const new_query_content = fs.readFileSync(path.join(__dirname+"/new_data.json"));

app.use('/', express.static(__dirname + "/"));

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+"/view/"+"index.html"));

});

app.get('/controller/dashboard_controller',(req,res)=>{
    res.send(query_result_map);
    res.sendFile(path.join(__dirname+"/view/"+"dashboard.html"));


});


app.post('/controller/dashboard_controller',(req,res)=>{
        database_dao.getQuery(req.body).then(function (data) {
            console.log('success');
            res.send({success: true,data:data});
            if(data!=null){
                query_content=data.query;
            }
        }).catch(function (err) {
            console.log('Error'+err);
            throw err;
        })
});


app.post('/controller/fetch_dashboard_controller',(req,res)=>{
    database_dao.getDashboard(req.body).then(function (data) {
        console.log('success dashboard');
        res.send({success:true,data:data});
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
})


app.post('/controller/dashboard_name_click_controller',(req,res)=>{
    database_dao.addSession(req.body).then(function () {
        console.log('success add session');
        database_dao.getQuery(req.body).then(function (data) {
            console.log('success');
            res.send({success: true,data:data})
            query_content=data.query;
        }).catch(function (err) {
            console.log('Error'+err);
            throw err;
        })
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })


});



app.get('/controller/edit_query_controller',(req,res)=>{
    if(query_content!=null) {
        res.send({data: query_content});
    }
});



app.get('/controller/new_query_controller',(req,res)=>{
    res.contentType('json');
    res.send(JSON.parse(new_query_content));
});



app.post('/controller/registration_controller', (req, res) => {
    database_dao.addUser(req.body).then(function (data) {
        console.log(data);
    	res.send({data:data});
    }).catch(function (err) {
    	console.log('Error'+err);
        throw err;
    })
});



app.post('/controller/login_controller', (req, res) => {
    database_dao.getLogin(req.body).then(function (data) {
        console.log('success login');
        res.send({success:true,data:data});
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })
});



app.post('/controller/new_content_controller',(req,res)=>{

    database_dao.addQuery(req.body).then(function (data) {
        console.log('success query');
        res.send({success: true,data:data})
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    })

});





app.post('/controller/edit_query_controller',(req,res)=>{
    const components=req.body.comp;
    const email = req.body.Email;
    let data;
    database_dao.updateQuery(req.body).then(function (data) {
        console.log('success update query');
        data=data;
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    });

    for(let i=0;i<components.length;i++){

        let sourceId=components[i].datasource;
        let queryReceived=components[i].query;
        let databaseReceived = components[i].database;
        let tableReceived = components[i].table;
        let data_body = {
            Email: email,
            Data_source: sourceId,
            Database: databaseReceived,
            Table: tableReceived,
            Query: queryReceived
        };
        //console.log(data_body)
        database_dao.getDataSource(data_body).then(function (data) {
            for(let j in data) {
                if (data === "null") {
                    console.log("null");
                }
                else if (data[j].data_source_name === "1") {
                    const elasticsearch = require('elasticsearch');
                    let client = new elasticsearch.Client({
                        hosts: data[j].host
                    });
                    query_arr = data[j].query.split(',');
                    for(let k in query_arr){
                        client.search(
                            {
                                index: data[j].database,
                                body: data[j].query,
                                type: data[j].table
                            })
                            .then(results => {
                                let p = results.hits.hits;
                                let arr = []
                                for (let ele = 0; ele < p.length; ele++) {
                                    let obj = p[ele]["_source"]
                                    arr.push(obj)
                                }
                                query_result_map[components[i]['id']] = arr
                                console.log(query_result_map)
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    }

                }
                else if (data[j].data_source_name === "2") {

                    const mongoose = require('mongoose');

                    mongoose.connect('mongodb://' + data[j].host + '/' + data[j].database, {useNewUrlParser: true});

                    let MongoClient = require('mongodb').MongoClient;
                    let url = 'mongodb://' + data[j].host + '/';
                    let db = mongoose.connection;
                    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
                        if (err) throw err;
                        let dbo = db.db(data[j].database);
                        dbo.collection(data[j].table).find(JSON.parse(data[j].query)).toArray(function (err, result) {
                            if (err) throw err;
                            let id = components[i].id;
                            query_result_map[id] = result
                            console.log(query_result_map)
                            db.close();
                        });
                    });


                }

            }

    }).catch(function (err){
            console.log('Error'+err);
            throw err;
        });
    }

    setTimeout(function () {
        console.log(query_result_map)
        res.send({success: true,data:data,map:query_result_map})
    },2000)
});


app.post('/controller/datasource',(req,res)=>{
    const components=req.body.comp;
    let data;
    database_dao.addDataSource(req.body).then(function (data) {
        console.log('successfull inserted');
    }).catch(function (err) {
        console.log('Error'+err);
        throw err;
    });

});


app.listen(7852, function () {
    console.log("Server started on http://localhost:7852");
});