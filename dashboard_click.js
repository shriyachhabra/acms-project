$(function () {
    let email = sessionStorage.getItem('session_email');

    $('#dashboard_list').on("click","a[name=dashboard_name]",function () {

        let id = $(this).attr('id');
        sessionStorage.setItem("id",id);
        $.post('/dashboard_click',
            {
                Email:email,
                id:id
            },function (data, err) {
                if (data.success) {
                    console.log("yay");
                    location.reload();
                }
                else
                    throw err;
            })

    })
})