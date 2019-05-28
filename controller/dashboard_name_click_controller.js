$(function () {
    let email = sessionStorage.getItem('session_email');

    $('#dashboard_list').on("click","a[name=dashboard_name]",function () {

        let id = $(this).attr('id');

        $.post('/controller/dashboard_name_click_controller',
            {
                Email:email,
                id:id
            },function (data, err) {
                if (data.success) {
                    sessionStorage.setItem("dashboard_id",id);
                    location.reload();
                }
                else
                    throw err;
            })

    })
})