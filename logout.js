$(function () {

    $('#logout').click(function () {
        sessionStorage.clear();
        sessionStorage.removeItem("id");
        window.sessionStorage.clear();
    })

})