$(function () {

    let email=sessionStorage.getItem("session_email");
    let username="";
    let database="";
    let password="";
    let host="";
    let data_source ="";
    $.post('/datasource',
        {
            Username: username,
            Database: database,
            Password: password,
            Host: host,
            Data_source: data_source,
            Email: email
        },
        function (req, res) {


            if(req.data===null) {
                console.log("null");
            }
            else {

                console.log("successfull");

            }

        }
    );


    $.get('/datasource',
        {
            Database: database,
            Data_source: data_source,
            Email: email
        },
        function (req, res) {

            if(req.data===null) {
                console.log("null");
            }
            else {
                host= req.data.host;
                username=req.data.username;
                password=req.data.password;
                console.log("successfull");

            }

        }
    );


})