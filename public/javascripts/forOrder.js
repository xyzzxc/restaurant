function Classes(){
    var classes = document.getElementById('classes')
    var index = classes.selectedIndex
    var option = classes.options[index]

    window.location.href = '/order/ordering'+option.value
}

function Menu(){
    var menu = document.getElementById('menu')
    var index = menu.selectedIndex
    var option = menu.options[index]

    var ia = document.getElementById('Ia')
    var image = document.getElementById('image')

    var detail = document.getElementById('detail')
    detail.selectedIndex = index
    detail = detail.options[index]
    detail.innerHTML=detail.innerHTML.replace(/\n/gi,'<br>')

    ia.href = '/menu/'+option.id+option.value
    image.src = '/menu/'+option.id+option.value

    var menuName = document.getElementById('menuName')
    menuName.innerHTML = option.innerHTML
    var content = document.getElementById('content')
    content.innerHTML = detail.innerHTML
    var price = document.getElementById('price')
    price.innerHTML = '$'+detail.value

    Num()
}

function Num(){
    var num = document.getElementById('num')
    var cost = document.getElementById('cost')
    var price = document.getElementById('price')

    cost.innerHTML = '$'+(num.value * (price.innerHTML).substr(1))

    var newNum = document.getElementById('newNum')
    newNum.value = num.value
    
    var newMenu = document.getElementById('newMenu')
    var menu = document.getElementById('menu')
    var index = menu.selectedIndex
    var option = menu.options[index]
    newMenu.value = option.id
}