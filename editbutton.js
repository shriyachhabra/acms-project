$(function () {
    let text=$('#myTextArea');
    let save=$('#save');

    $.get('/editbutton',
        function (req) {
            console.log(req)
            $('#dashboard_name').html(req.header);
            $('#myTextArea').html(JSON.stringify(req));
            sessionStorage.setItem("map",JSON.stringify(req));
        }
    )

    save.click(function () {
        let result=text.val();
        result=JSON.parse(result);
        console.log("hi vh");
        let components=result.components;


        sessionStorage.setItem("components",JSON.stringify(components));
        $.post('/editbutton',
                    {comp:components,
                        data:result
                    },
                    function (res) {
                      console.log(res)
                      sessionStorage.setItem("map",JSON.stringify(res));
                    }
                   )



       // console.log(result.components[0].type);
    })

})
