function Loading(menu){
    for(var i=0;i<menu/1;i++){
        var content = document.getElementById('content-'+i)
        content.innerHTML=content.innerHTML.replace(/\n/gi,'<br>')
    }
}
function Enable(menu_id){
    var enable = document.getElementById('enable-'+menu_id)
    var index = enable.selectedIndex
    var option = enable.options[index]

    window.location.href = '/information/enableMenu/'+menu_id+'/'+option.value
}