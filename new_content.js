$(function () {
    let new_dashboard = $('#myTextAreaNew');
let save=$('#save');
$.get('/new_content',
    function (req) {
        console.log(req)
        new_dashboard.html(JSON.stringify(req));
    }
)

save.click(function () {
    let result=new_dashboard.val();
    result=JSON.parse(result);
    console.log("hi vh");
    let components=result.components;


    sessionStorage.setItem("components",JSON.stringify(components));
    $.post('/new_content',
        {comp:components,
            data:new_dashboard.val()
        },
        function (res) {
            console.log(res)
        }
    )

})
})

