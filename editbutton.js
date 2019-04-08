$(function () {
    let text=$('#myTextArea');
    let save=$('#save');

    save.click(function () {
        let result=text.val();
        result=JSON.parse(result);
        console.log("hi vh");
        let components=result.components;


        sessionStorage.setItem("components",JSON.stringify(components));
        $.post('/editbutton',
                    {comp:components},
                    function (res) {
                      console.log(res)
                      sessionStorage.setItem("map",JSON.stringify(res));
                    }
                   )



       // console.log(result.components[0].type);
    })

})
