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
            $.each(tags,function (i) {
                dashboard_name.css(tags[i],styles[tags[i]]);
            });

            which_dashboard_title.html(config.page_header_title.title);


            page_heading.html(config.page_header_title.title);
            styles = config.page_header_title.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                page_heading.css(tags[i],styles[tags[i]]);
            });


            edit_button.html(config.edit_button.title);
            styles = config.edit_button.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                edit_button.css(tags[i],styles[tags[i]]);
            });


            new_dashboard_button.html(config.new_dashboard_button.title);
            styles = config.new_dashboard_button.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                new_dashboard_button.css(tags[i],styles[tags[i]]);
            });

            sessionStorage.setItem("map",JSON.stringify(req));
        }
    );

    save_button.click(function () {
        let result = text_box.val();
        result = JSON.parse(result);
        //console.log("hi vh");
        let components = result.components;

        /*console.log("components"+components);
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
                            sessionStorage.setItem("map", JSON.stringify(res.data));
                            //console.log("map"+JSON.stringify(res));
                            //alert("query updated");
                            window.open("/view/dashboard_view.html", "_self");
                        })
                    }*/

        sessionStorage.setItem("components",JSON.stringify(components));

            $.post('/updateConfig',
                {
                    config:text_box.val(),
                    dashboard_id: dashboard_id,
                    Email: email,
                    Dashboard_name: result.page_header_title.title
                },
                function (res) {
                    //sessionStorage.setItem("map", JSON.stringify(res));
                    //console.log("map"+JSON.stringify(res));
                    //alert("query updated");
                    swal({
                        title: "Success!",
                        text: "Query Updated!",
                        icon: "success",
                    }).then(()=> {
                        window.open("/view/dashboard_view.html","_self");
                    });
                }
            )

            // console.log(result.components[0].type);

    })



})
