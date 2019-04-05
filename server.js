const express = require('express');
const bp = require('body-parser');
//const query=require('./queryES');
const path=require('path');
const fs = require('fs');
const app=express();
const elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: ['http://127.0.0.1:9200']
});


const content = fs.readFileSync("data.json");
console.log(JSON.stringify(content));

app.use('/', express.static(__dirname + "/"));

app.use(bp.urlencoded({extended: true}))
app.use(bp.json())


app.get('/',(req,res)=>{
    res.sendFile('index.html');

})

app.get('/dashboard',(req,res)=>{
    res.sendFile('dashboard.html');

})

app.post('/dashboard',(req,res)=>{
    var quer=req.body.q;
    var x=req.body.x;
    var y=req.body.y;
    console.log(quer+" hi "+x+" "+y)
   var re= client.search(
        {
            index: 'tutorial',
            body:quer,
            type: 'cities_list' })
        .then(results => {
            // console.log(results.hits.hits)
            console.log(`found ${results.hits.total} items in ${results.took}ms`);
            // set the results to the result array we have

            p= results.hits.hits;;
            console.log(""+JSON.stringify(p[0]["_source"]));
            console.log(p.length)
            res.send(p)
        })
        .catch(err => {
            console.log(err)

        });

})

app.get('/test',function (req,res) {
    res.contentType('json');
    res.send(JSON.parse(content));
});

app.post('/change',function (req,res) {
    console.log(req.body.result);
    fs.writeFileSync("data.json",req.body.result);
});

app.listen(7890, function () {
    console.log("Server started on http://localhost:7890");
});