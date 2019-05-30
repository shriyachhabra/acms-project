$(function () {

    let email = sessionStorage.getItem('session_email');
    let dashboard_id = sessionStorage.getItem('dashboard_id');
    let page_heading = $('#pageheader_title');
    let which_dashboard_title = $('#which_title');
    let config;
    $.post('/controller/dashboard_controller',{
        dashboard_id:dashboard_id
    },function (req,res) {
        if (req.data === null) {
            console.log('data doesnt exist');
        } else {
            config = JSON.parse(req.data.config);
            console.log(req.data.config)
            page_heading.html(req.data.title);
            which_dashboard_title.html(req.data.title);

            let components = config.components;
    console.log("components"+components);
    console.log("length"+components.length);

    for(let i=0;i<components.length;i++) {
        console.log("database"+components[i].database);
        console.log("query"+components[i].query);
        console.log("table"+components[i].table);
        console.log("datasource"+components[i].datasource);
        $.post('/components/query/result',{
            query: components[i].query,
            datasource: components[i].datasource,
            database: components[i].database,
            table: components[i].table,
            Email:email
        },function (res) {
            console.log(res.data);
            //sessionStorage.setItem("map", JSON.stringify(res.data));
            //console.log("map"+JSON.stringify(res));
            //alert("query updated");
            //window.open("/view/dashboard_view.html", "_self");
            let map=res.data;
            console.log(map)
            //map=JSON.parse(map)
            //let components=sessionStorage.getItem("components")
            //components=JSON.parse(components)
            console.log(components)
            console.log(map)
            for(let i in components){
                let outputCSV="";
                let ele=components[i]
                console.log(ele)
                let x=ele['x-val']
                let y=ele['y-val']
                outputCSV+=x+","+y+"\n";
                console.log(outputCSV)
                let index = ele['id'];
                //console.log(index)
                let arr=map
                console.log("map"+arr)
                for(let j in arr ){

                    outputCSV+=arr[j][x]+","+arr[j][y]+"\n"
                }
                console.log("csv"+outputCSV)
                $('<div id='+i+' width="100%" height="60"></div>').appendTo('#graphid');
                let type=ele['type']

                if(type==='graph'){
                    if(document.getElementById(i)){
                        console.log('exists');
                        let g = new Dygraph(document.getElementById(i),outputCSV,ele['style']);
                    }else{
                        console.log("not exists");
                    }
                }
                if(type ==='bar'){
                    if(document.getElementById(i)){
                        console.log('exists');
                        //console.log(outputCSV);
                        //ele['style']["plotter"]=barChartPlotter;
                        function darkenColor(colorStr) {
                            // Defined in dygraph-utils.js
                            let color = Dygraph.toRGB_(colorStr);
                            color.r = Math.floor((255 + color.r) / 2);
                            color.g = Math.floor((255 + color.g) / 2);
                            color.b = Math.floor((255 + color.b) / 2);
                            return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                        }
                        ele['style']["plotter"]=function (e) {
                            let ctx = e.drawingContext;
                            let points = e.points;
                            let y_bottom = e.dygraph.toDomYCoord(0);
                            ctx.fillStyle = darkenColor(e.color);
                            // Find the minimum separation between x-values.
                            // This determines the bar width.
                            let min_sep = Infinity;
                            //for (let i = 1; i < points.length; i++) {
                            //let sep = points[i].canvasx - points[i - 1].canvasx;
                            let sep=50;
                            if (sep < min_sep) min_sep = sep;
                            //}
                            let bar_width = Math.floor(4.0 / 3 * min_sep);
                            // Do the actual plotting.
                            for (let i = 0; i < points.length; i++) {
                                let p = points[i];
                                let center_x = p.canvasx;
                                ctx.fillRect(center_x - bar_width / 2, p.canvasy,
                                    bar_width, y_bottom - p.canvasy);
                                ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
                                    bar_width, y_bottom - p.canvasy);
                            }
                        }
                        let g = new Dygraph(document.getElementById(i), outputCSV,ele['style']);
                    }else{
                        console.log("not exists");
                    }
                }

            }
        })
    }


        }
    })


    //NOTE: map contains the result of the query according to the component id





})