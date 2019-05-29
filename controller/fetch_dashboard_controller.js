$(function () {

    let email=sessionStorage.getItem("session_email");
    let get_user_name = sessionStorage.getItem("username");
    let username = $('#username');

    username.html(get_user_name);

    $.post('/controller/fetch_dashboard_controller',
        {
            Email: email
        },
        function (req, res) {


            if(req.data===null) {
                console.log("null");
            }
            else {
                for(let i=0;i<req.data.length;i++){
                let item=$('<li class="nav-item"></li>').appendTo('#dashboard_list');
                item.append($("<a class='nav-link' name='dashboard_name' href='#' id="+req.data[i].DNo+">"+req.data[i].title+"</a>"));
                }


            }

        }
    );


});