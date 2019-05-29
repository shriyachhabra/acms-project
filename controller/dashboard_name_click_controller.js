$(function () {
    let email = sessionStorage.getItem('session_email');

    $('#dashboard_list').on("click","a[name=dashboard_name]",function () {

        let dashboard_id = $(this).attr('id');

        $.post('/dashboard_name_click_controller/click',
            {
                Email:email,
                id:dashboard_id
            },function (data, err) {
                if (data.success) {
                    sessionStorage.setItem("dashboard_id",dashboard_id);
                    location.reload();
                }
                else
                    throw err;
            })

    })
})