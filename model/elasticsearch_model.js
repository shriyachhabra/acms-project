const elasticsearch = require('elasticsearch');

function query(data){
    const client = new elasticsearch.Client({
        hosts: data.host
    });
    return client.search(
            {
                index: data.database,
                body: data.query,
                type: data.table
            })
            .then(results => {
                let p = results.hits.hits;
                let arr = []
                for (let ele = 0; ele < p.length; ele++) {
                    let obj = p[ele]["_source"]
                    arr.push(obj)
                }
                return arr;
            })
            .catch(err => {
                console.log(err)
            }
            );
}

module.exports={
    query
}