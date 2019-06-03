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
            console.log("config" + req.data.config);

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
            console.log("components" + components);
            console.log("length of components" + components.length);

            for (let i=0;i<components.length;i++) {

                let query = components[i].query;
                let data_source = components[i].datasource;
                let database = components[i].database;
                let data_source_table = components[i].table;
                let index = components[i].id;
                let elements = components[i];
                console.log("database" + database);
                console.log("query" + query);
                console.log("table" + data_source_table);
                console.log("data_source" + data_source);
                $('<div id="component' + i + '" style="display:inline-flex; margin: 5px"></div>').appendTo('#graphid');

                $.post('/components/query/result', {
                    component_id: index,
                    query: query,
                    datasource: data_source,
                    database: database,
                    table: data_source_table,
                    Email: email
                }, function (res) {
                    console.log("result of query" + res.map);
                    let result = res.map;
                    console.log("result" + result);
                    console.log("components" + components);

                    let type = elements['type'];
                    if (type === "graph") {
                        let outputCSV = "";
                        let elements = components[i];
                        //console.log("elements" + elements['id']);
                        let x = elements['x-val'];
                        let y = elements['y-val'];
                        outputCSV += x + "," + y + "\n";

                        let arr = result[index];
                        console.log("array_result" + arr);
                        for (let j in arr) {
                            outputCSV += arr[j][x] + "," + arr[j][y] + "\n";
                        }
                        console.log("csv" + outputCSV);
                        if (document.getElementById("component"+i+"")) {
                            console.log('div with id ="component' + i + '" exists');
                            let g = new Dygraph(document.getElementById("component"+i+""), outputCSV, elements['style']);
                        } else {
                            console.log('div with id ="component'+i+'"not exists');
                        }
                    }
                    if (type === "bar") {
                        let outputCSV = "";
                        let elements = components[i];
                        //console.log("elements" + elements['id']);
                        let x = elements['x-val'];
                        let y = elements['y-val'];
                        outputCSV += x + "," + y + "\n";

                        let arr = result[index];
                        console.log("array_result" + arr);
                        for (let j in arr) {
                            outputCSV += arr[j][x] + "," + arr[j][y] + "\n";
                        }
                        console.log("csv" + outputCSV);
                        if (document.getElementById("component"+i+"")) {
                            console.log('div with id ="component'+i+'"exists');


                            function darkenColor(colorStr) {
                                // Defined in dygraph-utils.js
                                let color = Dygraph.toRGB_(colorStr);
                                color.r = Math.floor((255 + color.r) / 2);
                                color.g = Math.floor((255 + color.g) / 2);
                                color.b = Math.floor((255 + color.b) / 2);
                                return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                            }

                            elements['style']["plotter"] = function (e) {
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
                            let g = new Dygraph(document.getElementById("component"+i+""), outputCSV, elements['style']);

                        }
                        else {
                            console.log('div with id ="component'+i+'"not exists');
                        }
                    }
                    if (type === "table") {
                         if(document.getElementById("component"+i+"")) {
                             console.log('div with id ="component'+i+'" exists');
                             let arr = result[index];
                             console.log(arr);
                             let col = [];
                             for (let i = 0; i < arr.length; i++) {
                                 for (let key in arr[i]) {
                                     if (col.indexOf(key) === -1) {
                                         col.push(key);
                                     }
                                 }
                             }
                             let table = document.createElement("table");
                             /*let header = table.createCaption();
                             header.caption = "table";*/
                             let tr = table.insertRow(-1);
                             for (let i = 0; i < col.length; i++) {
                                 let th = document.createElement("th");
                                 th.innerHTML = col[i];
                                 tr.appendChild(th);
                             }
                             for (let i = 0; i < arr.length; i++) {
                                 tr = table.insertRow(-1);
                                 for (let j = 0; j < col.length; j++) {
                                     let tableCell = tr.insertCell(-1);
                                     tableCell.innerHTML = arr[i][col[j]];
                                     if (j === 0) {
                                         tableCell.setAttribute("style", "cursor:pointer");
                                         tableCell.onclick = function () {
                                             window.open("/view/table_view.html?id=" + arr[i][col[j]] + "?" + database + "?" + data_source + "?" + data_source_table, "_self");
                                         }
                                     }
                                 }
                             }
                             let divContainer = document.getElementById("component"+i+"");
                             divContainer.innerHTML = "";
                             divContainer.appendChild(table);
                         }
                         else {
                             console.log('div with id ="component'+i+'"not exists');
                         }
                    }

                });
            }


        }
    });

});