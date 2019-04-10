$(function () {
    let text=$('#myTextArea');
    let save=$('#save');
    let edit = $('#edit');
    let new_heading = $('#dashboard_name');
    let pageheader_title = $('#pageheader_title');
    let edit_button = $('#edit_button');
    let new_dashboard_button=$('#new_dashboard_button');
    let id = sessionStorage.getItem("id");
    $.get('/editbutton',
        function (req) {
            console.log(req);
              text.html(JSON.stringify(req));

            //header
            new_heading.html(req.header.title);
            var styles = req.header.style;
            var tags = Object.keys(styles);
            $.each(tags,function (i) {
                new_heading.css(tags[i],styles[tags[i]]);
                console.log(tags[i]+":"+styles[tags[i]]);
            });

            //page header title
            pageheader_title.html(req.page_header.title);
            styles = req.page_header.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                pageheader_title.css(tags[i],styles[tags[i]]);
                console.log(tags[i]+":"+styles[tags[i]]);
            });

            //edit button
            edit_button.html(req.edit_button.title);
            styles = req.edit_button.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                edit_button.css(tags[i],styles[tags[i]]);
                console.log(tags[i]+":"+styles[tags[i]]);
            });

            //new dashboard button
            new_dashboard_button.html(req.new_dashboard_button.title);
            styles = req.new_dashboard_button.style;
            tags = Object.keys(styles);
            $.each(tags,function (i) {
                new_dashboard_button.css(tags[i],styles[tags[i]]);
                console.log(tags[i]+":"+styles[tags[i]]);
            });

            sessionStorage.setItem("map",JSON.stringify(req));
        }
    );

    save.click(function () {
        let result=text.val();
        result=JSON.parse(result);
        console.log("hi vh");
        let components=result.components;


        sessionStorage.setItem("components",JSON.stringify(components));
        $.post('/editbutton',
                    {comp:components,
                        data:text.val(),
                        dno:id
                    },
                    function (res) {
                      console.log(res);
                      sessionStorage.setItem("map",JSON.stringify(res));
                    }
                   )



       // console.log(result.components[0].type);
    })

})
