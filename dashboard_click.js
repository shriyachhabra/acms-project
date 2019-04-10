$(function () {
    let email = sessionStorage.getItem('session_email');

    $('#dashboard_list').on("click","a[name=dashboard_name]",function () {
        //alert($(this).attr('id'))
        $.post('/dashboard_click',
            {
                Email:email,
                id:$(this).attr('id')
            },function (data, err) {
                if (data.success) {
                    console.log("yay");
                    sessionStorage.setItem("id",$(this).attr('id'));
                }
                else
                    throw err;
            })

    })
})