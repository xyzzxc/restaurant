function Del(orderID){
    var title = document.getElementById('title-'+orderID)
    var mytitle = document.getElementById('mytitle')
    mytitle.innerHTML = title.innerHTML+"：<br><br>"
    var content = document.getElementById('content-'+orderID)
    mytitle.innerHTML+=content.innerHTML

    var del = document.getElementById('delete')
    del.href = "/editOrder/delOrder/"+orderID
}

function Status(orderID){
    var status = document.getElementById('status-'+orderID)
    var index = status.selectedIndex
    var option = status.options[index]

    var yes = confirm('只有尚未處理狀態，顧客才能修改、刪除');
    if (yes) {
        window.location.href = '/editOrder/status/'+orderID+'/'+option.value
    }
}