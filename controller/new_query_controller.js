$(function () {
    let text_area = $('#myTextAreaNew');
    let save_button=$('#save');
    $.get('/getNewConfig/sampleData',
        function (req) {
            console.log(req);
            text_area.html(JSON.stringify(req));
            let ugly = $('#myTextAreaNew').val();
            console.log(ugly);
            let tData = JSON.parse(ugly);
            console.log(tData);
            let pretty = JSON.stringify(tData, undefined, 4);
            document.getElementById('myTextAreaNew').value = pretty;
        }
    );

    $(document).ready(function () {
        save_button.click(function () {
            let ugly = $('#myTextAreaNew').val();
            console.log(ugly);
            let tData = JSON.parse(ugly);
            console.log(tData);
            let constraint; /*= {
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
            let constraint1 = {
                "id": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string of integers"
                    }
                },
                "type": {

                    format: {
                        pattern: "^[a-zA-Z]*$",
                        message: "Enter a valid string"
                    }
                },
                "x-val": {

                    format: {
                        pattern: "^[a-zA-Z]*$",
                        message: "Enter a valid string"
                    }
                },
                "y-val": {

                    format: {
                        pattern: "^[a-zA-Z]*$",
                        message: "Enter a valid string"
                    }
                },
                "position": {

                    format: {
                        pattern: "^\\d+$",
                        message: "Enter a valid string of integers"
                    }
                },
                "datasource": {

                    format: {
                        pattern: "^[a-zA-Z]*$",
                        message: "Enter a valid string"
                    }
                }
            }
            let condition1 = (validate(tData, constraint));
            let condition2 = validate.isArray(tData["components"]);
            tData["components"].forEach(function (el) {
                if ((validate(el, constraint1) !== undefined)) {
                    condition3 = validate(el, constraint1);
                    //console.log(condition3);
                    return;
                } else {
                    //console.log("ok");
                    condition3 = undefined;
                }
            });

            if (condition1 === undefined && condition2 === true && condition3 === undefined) {
                    let result = text_area.val();
                    result = JSON.parse(result);

                    let components = result.components;
                    let email = sessionStorage.getItem("session_email");

                    sessionStorage.setItem("components", JSON.stringify(components));
                    $.post('/save_newConfig',
                        {
                            comp: components,
                            Config: text_area.val(),
                            Email: email,
                            dashboard_Title: result.page_header_title.title
                        },
                        function (res) {
                            console.log(res + " " + res.data);
                            let item = $('<li class="nav-item"></li>').appendTo('#dashboard_list');
                            item.append($("<a class='nav-link' href='../dashboard_view.html' id=" + res.data + ">" + result.page_header_title.title + "</a>"));
                            sessionStorage.setItem('dashboard_id', res.data);
                            swal({
                                title: "Success!",
                                text: "New Dashboard Made Successfully!",
                                icon: "success",
                            }).then(() => {
                                window.open("/view/dashboard_view.html", "_self");
                            });
                        }
                    );
            } else {
                console.log(condition1, condition2, condition3)
                $.each(condition1, function (i, val) {
                    console.log(val[0])
                    notycall(val[0]);
                })
                $.each(condition3, function (i, val) {
                    console.log(val[0])
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

