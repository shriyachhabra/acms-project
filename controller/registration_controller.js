$(function () {
    let username=$('#username');
    let email=$('#email');
    let input_pass=$('#password');
    let confirm_pass=$('#confirm_password');
    let register_button=$('#register');

    register_button.click(function () {
        if(username.val()===""||email.val()===""||input_pass.val()===""||confirm_pass.val()===""){
            alert("empty field");
        }
        else if(input_pass.val()!=confirm_pass.val()){
            alert("password dont match");
        }
        else
        {

            $.post('/controller/registration_controller',
                {
                    User_name: username.val(),
                    Email: email.val(),
                    Password: input_pass.val()
                },
                function (data, err) {
                    if (data.success) {
                        console.log("success");
                        sessionStorage.setItem("session_email",email.val());
                        sessionStorage.setItem("username",username.val());
                        window.open('/view/default_dashboard_view.html');
                        self.close();
                    }
                    else
                        alert("user exists")
                }
            );
        }
    })
});