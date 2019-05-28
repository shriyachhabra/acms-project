$(function () {
    let email = $('#inputEmail');
    let input_pass = $('#inputPassword');
    let sign_in = $('#sign_in');

    sign_in.click(function () {
        if (email.val() === "" || input_pass.val() === "") {
            alert("empty field");
        } else {
            $.post('/controller/login_controller',
                {
                    Email: email.val(),
                    Password: input_pass.val()
                },
                function (req, res) {

                    console.log(email.val());
                    if (req.data === null) {
                        alert('details not match');
                    } else if (email.val() === req.data.email && input_pass.val() === req.data.password) {
                        sessionStorage.clear();
                        sessionStorage.setItem("session_email", email.val());
                        sessionStorage.setItem("username", req.data.username);
                        sessionStorage.setItem("dashboard_id",req.data.last_session);
                        console.log(req.data.last_session)
                        window.open("/view/dashboard_view.html","_self");

                    }
                })
        }

    });



});
