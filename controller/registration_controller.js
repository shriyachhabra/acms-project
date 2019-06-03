$(function () {
    let username=$('#username');
    let email=$('#email');
    let input_pass=$('#password');
    let confirm_pass=$('#confirm_password');
    let register_button=$('#register');

    register_button.click(function () {
        if(username.val()===""||email.val()===""||input_pass.val()===""||confirm_pass.val()===""){
            swal({
                title: "Oops!",
                text: "Empty fields!",
                icon: "error",
            });
        }
        else if(input_pass.val()!=confirm_pass.val()){
            swal({
                title: "Oops!",
                text: "Password doesnt match!",
                icon: "error",
            });
        }
        else
        {
            let allowed = 0;

            $.post('/registration',
                {
                    User_name: username.val(),
                    Email: email.val(),
                    Password: input_pass.val(),
                    Allowed:allowed
                },
                function (req,res) {
                    if (req.data === 0) {

                        swal({
                            title: "Oops!",
                            text: "User Already Exists!",
                            icon: "error",
                        });

                    }
                    else{
                        swal({
                            title: "Success!",
                            text: "Registration Successful!",
                            icon: "success",
                        }).then(() => {
                            window.open("/view/index.html", "_self");
                        });
                    }
            });
        }
    });
});