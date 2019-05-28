$(function () {

    $('#logout').click(function () {
        sessionStorage.clear();
        sessionStorage.removeItem("dashboard_id");
        sessionStorage.removeItem("session_email");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("map");
        sessionStorage.removeItem("components");
        window.sessionStorage.clear();
        window.open('/view/index.html',"_self");
    });
});