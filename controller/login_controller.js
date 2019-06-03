$(function () {
    let input_email = $('#inputEmail');
    let input_pass = $('#inputPassword');
    let sign_in_button = $('#sign_in');

    sign_in_button.click(function () {
        if (input_email.val() === "" || input_pass.val() === "") {
            alert("empty field");
        } else {
            $.post('/login',
                {
                    Email: input_email.val(),
                    Password: input_pass.val()
                },
                function (req, res) {

                    console.log(input_email.val());
                    if (req.data === null) {
                        swal({
                            title: "Oops!",
                            text: "Details not matched!",
                            icon: "error",
                        });
                    } else if (input_email.val() === req.data.email && input_pass.val() === req.data.password) {
                        if(req.data.allowed_login===0){
                            swal({
                                title: "Oops!",
                                text: "Not allowed to login. Ask admin to give access!",
                                icon: "error",
                            });
                        }else{
                            if(req.data.last_session!=null){
                                sessionStorage.setItem("session_email", input_email.val());
                                sessionStorage.setItem("username", req.data.username);
                                sessionStorage.setItem("dashboard_id",req.data.last_session);
                                console.log(req.data.last_session);
                                swal({
                                    title: "Success!",
                                    text: "Login Successful!",
                                    icon: "success",
                                }).then(()=> {
                                    window.open("/view/dashboard_view.html","_self");
                                });

                            }else{
                                sessionStorage.setItem("session_email", input_email.val());
                                sessionStorage.setItem("username", req.data.username);
                                swal({
                                    title: "Success!",
                                    text: "Login Successful!",
                                    icon: "success",
                                }).then(()=>{
                                        window.open("/view/default_dashboard_view.html","_self");

                                });

                            }

                        }


                    }
                })
        }

    });



});
