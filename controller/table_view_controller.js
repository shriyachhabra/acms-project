$(function () {

    let email = sessionStorage.getItem("session_email");
    let text_box=$('#myTextArea');
    let save_button=$('#save');
    let dashboard_name = $('#dashboard_name');
    let page_heading = $('#pageheader_title');
    let which_dashboard_title = $('#which_title');
    let edit_button = $('#edit_button');
    let new_dashboard_button=$('#new_dashboard_button');
    let username = $('#username');
    let get_user = sessionStorage.getItem("username");
    let dashboard_id = sessionStorage.getItem("dashboard_id");
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    let url_param = searchParams.get("id").split('?');
    let id;
    let database;
    let datasource
    let table;
    let query={};
    let okay_button = $('#okay');
    $.post('/getConfig',{
            dashboard_id:dashboard_id
        },
        function (req,res) {
            let config = JSON.parse(req.data.config);
            console.log(config);
            text_box.html(JSON.stringify(config));

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
        }
    );
    okay_button.click(function () {
        window.open("../view/dashboard_view.html", "_self");
    });
    for(let i in url_param){
            id = url_param[0];
            database = url_param[1];
            datasource = url_param[2];
            table = url_param[3];

    }
    //console.log(id+database+table+datasource);
    if(datasource==="mongodb"){
        query = "{_id:ObjectId(\""+id+"\")}";
        //console.log(JSON.stringify(query));
    }else if (datasource === "elasticsearch"){
        query = "{\"query\":{\"match\": {\"Product Id\": \""+id+"\"}}}";
    }
    $.post('/components/query/result',{
        query:JSON.stringify(query),
        datasource: datasource,
        database: database,
        table: table
    },function (res) {
        console.log("result of query"+res.data);
        let result=res.data;
        let col = [];
        for(let i=0;i<result.length;i++){
            for(let key in result[i]){
                if(col.indexOf(key)=== -1){
                    col.push(key);
                }
            }
        }
        let table = document.createElement("table");
        /*let header = table.createCaption();
        header.caption = "table";*/
        let tr = table.insertRow(-1);
        for(let i=0;i<col.length;i++){
            let th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        for(let i=0;i<result.length;i++){
            tr = table.insertRow(-1);
            for(let j=0;j<col.length;j++){
                let tableCell = tr.insertCell(-1);
                tableCell.innerHTML = result[i][col[j]];
                if(j===0){
                    tableCell.setAttribute("style","cursor:pointer");
                    tableCell.onclick = function() {
                        window.open("/view/table_view.html?id="+result[i][col[j]]+"?"+database+"?"+datasource+"?"+datasource_table,"_self");
                    }
                }
            }
        }
        let divContainer = document.getElementById("table_view");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    });
});