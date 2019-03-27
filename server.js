const express = require('express');
const bp = require('body-parser');
//const query=require('./queryES');
const app=express();
const elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: ['http://127.0.0.1:9200']
});




app.use('/', express.static(__dirname + "/"));

app.use(bp.urlencoded({extended: true}))
app.use(bp.json())

app.get('/',(req,res)=>{
    res.sendFile('index.html');

})

app.post('/',(req,res)=>{
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



app.listen(7890, function () {
    console.log("Server started on http://localhost:7890");
});