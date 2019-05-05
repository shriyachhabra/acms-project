$(function () {
    let email = sessionStorage.getItem("session_email");
    let text=$('#myTextArea');
    let save=$('#save');
    let edit = $('#edit');
    let new_heading = $('#dashboard_name');
    let pageheader_title = $('#pageheader_title');
    let which_title = $('#which_title');
    let edit_button = $('#edit_button');
    let new_dashboard_button=$('#new_dashboard_button');
    let username = $('#username');
    let get_user = sessionStorage.getItem("username");
    let id = sessionStorage.getItem("dashboard_id");
    //console.log("id="+id);
    $.get('/editbutton',
        function (req,res) {
            var data = JSON.parse(req.data);
            console.log(data);
              text.html(JSON.stringify(data));

              username.html(get_user);


            new_heading.html(data.header.title);
            var styles = data.header.style;
            var tags = Object.keys(styles);
            $.each(tags,function (i) {
                new_heading.css(tags[i],styles[tags[i]]);
                //console.log(tags[i]+":"+styles[tags[i]]);
            });

            which_title.html(data.page_header.title);


            pageheader_title.html(data.page_header.title);
            styles = data.page_header.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                pageheader_title.css(tags[i],styles[tags[i]]);
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

    save.click(function () {
        let result=text.val();
        result=JSON.parse(result);
        console.log("hi vh");
        let components=result.components;


        sessionStorage.setItem("components",JSON.stringify(components));
        $.post('/editbutton',
                    {
                        comp:components,
                        data:text.val(),
                        dno:id,
                        Email:email
                        //Dash_name:result.page_header.title
                    },
                    function (res) {
                      //console.log(res);
                      sessionStorage.setItem("map",JSON.stringify(res));
                      //console.log("map"+JSON.stringify(res));
                      //alert("query updated");
                        window.open("/dashboard.html","_self");
                    }
                   )

       // console.log(result.components[0].type);
    })

})
