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
            Email:email
        },
        function (res) {
            console.log(res+" "+email);
        }
    )

})
});

