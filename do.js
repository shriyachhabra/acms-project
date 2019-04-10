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

            $.post('/do',
                {
                    User_name: username.val(),
                    Email: email.val(),
                    Password: input_pass.val()
                },
                function (data, err) {
                    if (data.success) {
                        console.log("success");
                    }
                    else
                        throw err;
                }
            );
            sessionStorage.setItem("session_email",email.val());
            window.open('/dashboard.html');
            self.close();
        }
    })
});