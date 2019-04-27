$(function () {

    let id = sessionStorage.getItem('dashboard_id');
    let pageheader_title = $('#pageheader_title');
    let which_title = $('#which_title');
    $.post('/dashboard',{
        id:id
    },function (req,res) {
        if (req.data === null) {
            console.log('data doesnt exist');
        } else {
            pageheader_title.html(req.data.title);
            which_title.html(req.data.title);
        }
    })

    function barChartPlotter(e) {
        var ctx = e.drawingContext;
        var points = e.points;
        var y_bottom = e.dygraph.toDomYCoord(0);

        // This should really be based on the minimum gap
        var bar_width = 2/3 * (points[1].canvasx - points[0].canvasx);
        ctx.fillStyle = e.color;

        // Do the actual plotting.
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var center_x = p.canvasx;  // center of the bar

            ctx.fillRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);
            ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);
        }
    }


    //NOTE: map contains the result of the query according to the component id
 var map=sessionStorage.getItem("map")
    map=JSON.parse(map)
 var components=sessionStorage.getItem("components")
    components=JSON.parse(components)
    console.log(components)
    //console.log(map)
 for(let i in components){
     let outputCSV="";
     let ele=components[i]
     //console.log(ele)
     let x=ele['x-val']
     let y=ele['y-val']
     outputCSV+=x+","+y+"\n";
     let arr=map[ele['id']]
     //console.log(arr)
    for(let j in arr ){

        outputCSV+=arr[j][x]+","+arr[j][y]+"\n"
    }
    console.log(outputCSV)
     $('<div id='+i+' width="100%" height="30"></div>').appendTo('#graphid');
     let type=ele['type']

     if(type==='graph'){
         if(document.getElementById(i)){
             console.log('exists');
             let g = new Dygraph(document.getElementById(i),outputCSV,ele['style']);
         }else{
             console.log("not exists");
         }
     }
     else if(type ==='bar'){
         if(document.getElementById(i)){
             console.log('exists');
             ele['style']["plotter"]=barChartPlotter;
             let g = new Dygraph(document.getElementById(i), outputCSV,ele['style']);
         }else{
             console.log("not exists");
         }
     }

    }




})