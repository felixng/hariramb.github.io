var x = new XMLHttpRequest();
x.open("GET", "http://127.0.0.1:9000/temp.txt");
x.send();
document.write(x.responseText);
