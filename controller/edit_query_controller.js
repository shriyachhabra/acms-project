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


    $(document).ready(function () {
        var prettyPrint = $("#pretty");
        prettyPrint.click(function() {
            var ugly = document.getElementById('myTextArea').value;
            var tData = JSON.parse(ugly);
            var pretty = JSON.stringify(tData, undefined, 4);
            document.getElementById('myTextArea').value = pretty;
        })
        save_button.click(function () {
            var ugly = document.getElementById('myTextArea').value;
            var tData = JSON.parse(ugly);
            var constraint /*= {
                "header.title": {

                },
                "header.style": {

                },
                "header.style.color": {


                },
                "header.style.height": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },
                "header.style.width": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },

                "page_header.title": {

                },
                "page_header.style": {

                },
                "page_header.style.color": {


                },
                "page_header.style.height": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },
                "page_header.style.width": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },

                "edit_button.title": {

                },
                "edit_button.style": {

                },
                "edit_button.style.color": {


                },
                "edit_button.style.height": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },
                "edit_button.style.width": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },

                "new_dashboard_button.title": {

                },
                "new_dashboard_button.style": {

                },
                "new_dashboard_button.style.color": {


                },
                "new_dashboard_button.style.height": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                },
                "new_dashboard_button.style.width": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string having only integer"
                    }
                }
            };*/
            var constraint1 = {
                "id": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string of integers"
                    }
                },
                "type": {

                    format: {
                        pattern: "^[a-zA-Z]*$"
                    }
                },
                "x-val": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string of integers"
                    }
                },
                "y-val": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string of integers"
                    }
                },
                "position": {

                    format: {
                        pattern: "^[1-9][0-9]*$",
                        message: "Enter a valid string of integers"
                    }
                },
                "datasource": {

                    format: {
                        pattern: "^[1-2]$",
                        message: "Enter a valid string of integers"
                    }
                }
            }
            var condition1 = (validate(tData, constraint));
            var condition2 = validate.isArray(tData["components"]);
            tData["components"].forEach(function (el) {
                if ((validate(el, constraint1) !== undefined)) {
                    condition3 = validate(el, constraint1);
                    //console.log(condition3);
                    return;
                } else {
                    //console.log("ok");
                    condition3 = undefined;
                }
            })

            if (condition1 === undefined && condition2 === true && condition3 === undefined) {
                var pretty = JSON.stringify(tData, undefined, 4);
                document.getElementById('myTextArea').value = pretty;
                console.log("Hi");
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

            } else {
                console.log(condition1, condition2, condition3)
                $.each(condition1, function (i, val) {
                    console.log("test",val[0])
                    notycall(val[0]);
                })
                $.each(condition3, function (i, val) {
                    console.log("test1",val[0])
                    notycall(val[0]);
                })
            }
        });
    });

    function notycall(input_text) {
        noty({
            text: input_text,
            layout: 'topRight',
            theme: 'defaultTheme', // or relax
            type: 'warning',
            timeout: 1500,
            progressBar: true,
            animation: {
                open: { height: 'toggle' },
                close: { height: 'toggle' },
                easing: 'swing',
                speed: 500 // opening & closing animation speed
            }
        });
    }
});
