var date;
date = new Date();
date = date.getFullYear() + '-' +
    ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + ' ' + 
    ('00' + date.getHours()).slice(-2) + ':' + 
    ('00' + date.getMinutes()).slice(-2) + ':' + 
    ('00' + date.getSeconds()).slice(-2);
console.log(date);

var test = new Date('2020/01/31')
test.setDate(test.getDate()+1)
console.log(test.toLocaleDateString())