const express = require('express');
const bp = require('body-parser');
const database_dao = require('./dao/database_dao');
const elastic_dao = require('./dao/elasticsearch_dao');
const mongodb_dao = require('./dao/mongodb_dao');
const path = require('path');
const fs = require('fs');
const app = express();
const new_config_content = fs.readFileSync(path.join(__dirname + "/new_data.json"));
app.use('/', express.static(__dirname + "/"));
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());



app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname + "/view/" + "index.html"));
    }
    catch (err) {
        console.log("error for start file " + err);
        throw err;
    }

});



app.post('/getConfig', (req, res) => {
    database_dao.getConfig(req.body).then(function (data) {
        console.log('successful fetching of config');
        res.send({ success: true, data: data });
    }).catch(function (err) {
        console.log('Error from /getConfig ' + err);
        throw err;
    });
});



app.post('/controller/fetch_dashboard_controller', (req, res) => {
    database_dao.getDashboard(req.body).then(function (data) {
        console.log('successful fetching of dashboard');
        res.send({ success: true, data: data });
    }).catch(function (err) {
        console.log('Error from /controller/fetch_dashboard_controller' + err);
        throw err;
    });
});


app.post('/dashboard_name_click_controller/click', (req, res) => {
    database_dao.addSession(req.body).then(function () {
        console.log("dashboard click id " + req.body);
        console.log('success add session');
        database_dao.getConfig(req.body).then(function (data) {
            console.log('successful get config');
            res.send({ success: true, data: data });
        }).catch(function (err) {
            console.log('Error from /dashboard_name_click_controller/click in getConfig' + err);
            throw err;
        });
    }).catch(function (err) {
        console.log('Error from /dashboard_name_click_controller/click in addSession' + err);
        throw err;
    });


});



app.get('/getNewConfig/sampleData', (req, res) => {
    try {
        res.contentType('json');
        res.send(JSON.parse(new_config_content));
    } catch (err) {
        console.log("Error from /getNewConfig " + err);
        throw err;
    }

});



app.post('/registration', (req, res) => {
    database_dao.addUser(req.body).then(function (data) {
        res.send({ success: true, data: data });
    }).catch(function (err) {
        console.log('Error from /registration ' + err);
        throw err;
    })
});



app.post('/login', (req, res) => {
    database_dao.getLogin(req.body).then(function (data) {
        console.log('success login');
        res.send({ success: true, data: data });
    }).catch(function (err) {
        console.log('Error from /login ' + err);
        throw err;
    })
});



app.post('/save_newConfig', (req, res) => {

    database_dao.addConfig(req.body).then(function (data) {
        console.log('success config');
        res.send({ success: true, data: data });
        if(data!=null){
            let result={
                Email:req.body.Email,
                dashboard_id:data
            };
            database_dao.addSession(result).then(function () {
                res.send({success: true,data:data});
            }).catch(function (err) {
                console.log("error in adding session"+err);
                throw err;
            })
        }
    }).catch(function (err) {
        console.log('Error from /save_newConfig' + err);
        throw err;
    })

});


app.post('/components/query/result', (req, res) => {
    database_dao.getDataSource(req.body).then(function (data) {

        let component_id = req.body.component_id;

        let data_body = {
            name: req.body.id,
            query: req.body.query,
            host: data.host,
            datasource: data.data_source_name,
            database: data.database,
            table: data.table
        };

        if (data === "null") {
            console.log("data received is null in /components/query/result");
        }
        if (data.data_source_name === "elasticsearch") {

            try {
                elastic_dao.query(data_body, data => {
                    let query_result_map={};
                    query_result_map[component_id]=data;
                    console.log(query_result_map);
                    console.log("result from elasticsearch" + data);
                    res.send({success: true, data: data,map:query_result_map});

                })
            }
            catch (err) {
                console.log('Error from elasticsearch' + err);
                throw err;
            }

        }
        if (data.data_source_name === "mongodb") {

            try {
                mongodb_dao.query(data_body,data=>{
                    let query_result_map={};
                    query_result_map[component_id]=data;
                    console.log(query_result_map);
                    console.log("result from mongo"+data);
                    res.send({success:true,data:data,map:query_result_map});
                });

            } catch (err) {
                console.log('Error from mongodb' + err);
                throw err;
            }

        }
    }).catch(function (err) {
        console.log('Error from /components/query/result' + err);
        throw err;
    });
});


app.post('/updateConfig', (req, res) => {
    database_dao.updateConfig(req.body).then(function (data) {
        console.log('success update config');
        res.send({ success: true, data: data });
    }).catch(function (err) {
        console.log('Error in update config' + err);
        throw err;
    });
});


app.listen(7860, function () {
    console.log("Server started on http://localhost:7850");
});