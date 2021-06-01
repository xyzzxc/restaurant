function Checkin(id,check){
    var hyper = document.getElementById(id)
    var date = document.getElementById("date")
    var time = document.getElementById("time")

    hyper.href = "/check/checkin/"+date.value+" "+time.value+"/"+check
}