$(function () {
    let queryf=$('#qu')
    let bar=$('#bar')
    let xf=$('#x')
    let yf=$('#y')
    let graphid=$('#graphid')
let outg="" //output for graph


    bar.click(function () {
        console.log("hi")
        console.log("g")
        $.post('/',
            {q:queryf.val(), x:xf.val(),y:yf.val()},
            function (result) {
                 outg+=xf.val()+","+yf.val()+"\n"
                console.log("rec "+result.length)
                for( let i=0;i<result.length;i++){
                   let x =result[i]["_source"][xf.val()];
                   let y =result[i]["_source"][yf.val()];
                   outg+=x+","+y+"\n"
                }

             console.log(outg)
                const g = new Dygraph(document.getElementById("graphid")
                    , outg, {
                        fillGraph: true
                    });
            }
            )
    })


})