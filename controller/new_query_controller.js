$(function () {
    let text_area = $('#myTextAreaNew');
    let save_button=$('#save');
$.get('/getNewConfig/sampleData',
    function (req) {
        console.log(req);
        text_area.html(JSON.stringify(req));
    }
);

save_button.click(function () {
    let result=text_area.val();
    result=JSON.parse(result);

    let components=result.components;
    let email = sessionStorage.getItem("session_email");

    sessionStorage.setItem("components",JSON.stringify(components));
    $.post('/save_newConfig',
        {comp:components,
            Config:text_area.val(),
            Email:email,
            dashboard_Title:result.page_header.title
        },
        function (res) {
            console.log(res+" "+res.data);
            let item=$('<li class="nav-item"></li>').appendTo('#dashboard_list');
            item.append($("<a class='nav-link' href='../dashboard_view.html' id="+res.data+">"+result.page_header.title+"</a>"));
            alert("new dashboard created");
            sessionStorage.setItem('dashboard_id',res.data);
            window.open("/view/dashboard_view.html","_self");
        }
    )

})
});

