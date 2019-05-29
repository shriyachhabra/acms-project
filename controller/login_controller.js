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
                        alert('details not match');
                    } else if (input_email.val() === req.data.email && input_pass.val() === req.data.password) {
                        sessionStorage.clear();
                        sessionStorage.setItem("session_email", input_email.val());
                        sessionStorage.setItem("username", req.data.username);
                        sessionStorage.setItem("dashboard_id",req.data.last_session);
                        console.log(req.data.last_session)
                        window.open("/view/dashboard_view.html","_self");

                    }
                })
        }

    });



});
