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

    save_button.click(function () {
        let result = text_box.val();
        result = JSON.parse(result);
        let components = result.components;
        $.post('/updateConfig',
            {
                config: text_box.val(),
                dashboard_id: dashboard_id,
                Email: email,
                Dashboard_name: result.page_header_title.title
            },
            function (res) {
                swal({
                    title: "Success!",
                    text: "Query Updated!",
                    icon: "success",
                }).then(() => {
                    window.open("/view/dashboard_view.html", "_self");
                });
            }
        )
    });
});
