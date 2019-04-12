$(function () {
    let new_dashboard = $('#myTextAreaNew');
    let save=$('#save');
$.get('/new_content',
    function (req) {
        console.log(req);
        new_dashboard.html(JSON.stringify(req));
    }
);

save.click(function () {
    let result=new_dashboard.val();
    result=JSON.parse(result);
    console.log("hi vh");
    let components=result.components;
    let email = sessionStorage.getItem("session_email");

    sessionStorage.setItem("components",JSON.stringify(components));
    $.post('/new_content',
        {comp:components,
            Query:new_dashboard.val(),
            Email:email,
            dashboard_Title:result.page_header.title
        },
        function (res) {
            console.log(res+" "+res.data);
            let item=$('<li class="nav-item"></li>').appendTo('#dashboard_list');
            item.append($("<a class='nav-link' href='../dashboard.html' id="+res.data+">"+result.page_header.title+"</a>"));
            alert("new dashboard created");
            window.open("/dashboard.html","_self");
        }
    )

})
});

