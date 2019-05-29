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
    let id = sessionStorage.getItem("dashboard_id");
    $.get('/getConfig',
        function (req,res) {
            var data = JSON.parse(req.data);
            console.log(data);
              text_box.html(JSON.stringify(data));

              username.html(get_user);


            dashboard_name.html(data.header.title);
            var styles = data.header.style;
            var tags = Object.keys(styles);
            $.each(tags,function (i) {
                dashboard_name.css(tags[i],styles[tags[i]]);
                //console.log(tags[i]+":"+styles[tags[i]]);
            });

            which_dashboard_title.html(data.page_header.title);


            page_heading.html(data.page_header.title);
            styles = data.page_header.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                page_heading.css(tags[i],styles[tags[i]]);
                //console.log(tags[i]+":"+styles[tags[i]]);
            });


            edit_button.html(data.edit_button.title);
            styles = data.edit_button.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                edit_button.css(tags[i],styles[tags[i]]);
                //console.log(tags[i]+":"+styles[tags[i]]);
            });


            new_dashboard_button.html(data.new_dashboard_button.title);
            styles = data.new_dashboard_button.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                new_dashboard_button.css(tags[i],styles[tags[i]]);
                //console.log(tags[i]+":"+styles[tags[i]]);
            });

            sessionStorage.setItem("map",JSON.stringify(req));
        }
    );

    save_button.click(function () {
        let result=text_box.val();
        result=JSON.parse(result);
        //console.log("hi vh");
        let components=result.components;


        sessionStorage.setItem("components",JSON.stringify(components));
        $.post('/updateConfig',
                    {
                        comp:components,
                        data:text_box.val(),
                        dno:id,
                        Email:email
                        //Dash_name:result.page_header.title
                    },
                    function (res) {
                      //console.log(res);
                      sessionStorage.setItem("map",JSON.stringify(res));
                      //console.log("map"+JSON.stringify(res));
                      //alert("query updated");
                        window.open("/view/dashboard_view.html","_self");
                    }
                   )

       // console.log(result.components[0].type);
    })

})
