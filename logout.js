$(function () {

    $('#logout').click(function () {
        sessionStorage.clear();
        window.sessionStorage.clear();
        if(sessionStorage.getItem("id")===null){
        window.open('/index.html',"_self");
       }
        //console.log(sessionStorage);
    })


})