$(function () {
    //fetch dashboard
    let email=sessionStorage.getItem("session_email");
    console.log(email);
    //fetch dashboards
    $.post('/fetch_dashboard',
        {
            Email: email
        },
        function (req, res) {

        console.log(req.data[0].DNo);

            if(req.data===null) {
                console.log("null");
            }
            else {
                console.log("hy"+req.data[1].title);
                //.setItem("fetch_dash",req.data);
                for(let i=0;i<req.data.length;i++){
                let item=$('<li class="nav-item"></li>').appendTo('#dashboard_list');
                item.append($("<a class='nav-link' name='dashboard_name' href='#' id="+req.data[i].DNo+">"+req.data[i].title+"</a>"));
                }


            }

        }
    );


})