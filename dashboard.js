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
$(function () {


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
     //Koshima di code
     if(type==='graph'){
         if(document.getElementById(i)){
             console.log('exists');
             let g = new Dygraph(document.getElementById(i),outputCSV,ele['style']);
         }else{
             console.log("not exists hy'+i+'");
         }
     }
     else if(type ==='bar'){
         if(document.getElementById(i)){
             console.log('exists');
             let g = new Dygraph(document.getElementById(i), outputCSV, {
                 plotter: barChartPlotter
             });
         }else{
             console.log("not exists hy'+i+'");
         }
     }

    }


})