$.ajax({url:'/test',
    type:"GET",
    dataType:"json",
    success:(data)=>{
        console.log('ajax sucess1',data);
        console.log('component',data.header);
        $('#dashboard_name').html(data.header);
        $('#myTextArea').html(JSON.stringify(data));
    }});

$('#save').click(function () {
    var result=$('#myTextArea').val();
    console.log("data sending"+result);
    $.ajax({url:'/change',
        type:"POST",
        dataType:"json",
        data:{result:result},
        success:(data)=>{
            console.log('datasend',data);
            //$('#json_edit').html('edit data'+JSON.stringify(data));
        }});
})