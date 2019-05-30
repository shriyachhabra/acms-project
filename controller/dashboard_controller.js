$(function () {

    let email = sessionStorage.getItem('session_email');
    let dashboard_id = sessionStorage.getItem('dashboard_id');
    let dashboard_name = $('#dashboard_name');
    let page_heading = $('#pageheader_title');
    let which_dashboard_title = $('#which_title');
    let edit_button = $('#edit_button');
    let new_dashboard_button=$('#new_dashboard_button');
    let username = $('#username');
    let get_user = sessionStorage.getItem("username");
    let config;
    $.post('/getConfig',{
        dashboard_id:dashboard_id
    },function (req,res) {
        if (req.data === null) {
            console.log('data doesnt exist');
        } else {
            config = JSON.parse(req.data.config);
            console.log("config"+req.data.config);

            //dashboard buttons and heading change
            username.html(get_user);


            dashboard_name.html(config.header.title);
            let styles = config.header.style;
            let tags = Object.keys(styles);
            $.each(tags, function (i) {
                dashboard_name.css(tags[i], styles[tags[i]]);
            });

            which_dashboard_title.html(config.page_header_title.title);


            page_heading.html(config.page_header_title.title);
            styles = config.page_header_title.style;
            tags = Object.keys(styles);
            $.each(tags, function (i) {
                page_heading.css(tags[i], styles[tags[i]]);
            });


            edit_button.html(config.edit_button.title);
            styles = config.edit_button.style;
            tags = Object.keys(styles);
            $.each(tags, function (i) {
                edit_button.css(tags[i], styles[tags[i]]);
            });


            new_dashboard_button.html(config.new_dashboard_button.title);
            styles = config.new_dashboard_button.style;
            tags = Object.keys(styles);
            $.each(tags, function (i) {
                new_dashboard_button.css(tags[i], styles[tags[i]]);
            });


            //drawing of graph
            let components = config.components;
            console.log("components"+components);
            console.log("length of components"+components.length);

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
                    console.log("result of query"+res.data);
                    let result=res.data;
                    console.log("result"+result);
                    console.log("components"+components);
                    for(let i in components){
                        let outputCSV="";
                        let elements=components[i];
                        console.log("elements"+elements);
                        let x=elements['x-val'];
                        let y=elements['y-val'];
                        outputCSV+=x+","+y+"\n";
                        let index = elements['id'];
                        let arr=result;
                        console.log("array_result"+arr);
                        for(let j in arr ){
                            outputCSV+=arr[j][x]+","+arr[j][y]+"\n";
                        }
                        console.log("csv"+outputCSV);
                        $('<div id='+i+' width="100%" height="60"></div>').appendTo('#graphid');
                        let type=elements['type'];
                        if(type==='graph') {
                            if (document.getElementById(i)) {
                                console.log('div with id =' + i + 'exists');
                                let g = new Dygraph(document.getElementById(i), outputCSV, elements['style']);
                            } else {
                                console.log('div with id =' + i + 'not exists');
                            }
                        }
                        if(type ==='bar'){
                            if(document.getElementById(i)){
                                console.log('div with id =' + i + 'exists');
                                function darkenColor(colorStr) {
                                    // Defined in dygraph-utils.js
                                    let color = Dygraph.toRGB_(colorStr);
                                    color.r = Math.floor((255 + color.r) / 2);
                                    color.g = Math.floor((255 + color.g) / 2);
                                    color.b = Math.floor((255 + color.b) / 2);
                                    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                                }
                                elements['style']["plotter"]=function (e) {
                                    let ctx = e.drawingContext;
                                    let points = e.points;
                                    let y_bottom = e.dygraph.toDomYCoord(0);
                                    ctx.fillStyle = darkenColor(e.color);
                                    // Find the minimum separation between x-values.
                                    // This determines the bar width.
                                    let min_sep = Infinity;
                                    /*for (let i = 1; i < points.length; i++) {
                                        let sep = points[i].canvasx - points[i - 1].canvasx;
                                        if (sep < min_sep) min_sep = sep;
                                    }*/
                                    let sep = 50;
                                    if (sep < min_sep) min_sep = sep;
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
                                };
                                let g = new Dygraph(document.getElementById(i), outputCSV,elements['style']);
                            }else{
                                console.log('div with id =' + i + 'not exists');
                            }
                        }
                    }
                });
            }

        }
    });

});