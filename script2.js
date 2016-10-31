var x = new XMLHttpRequest();
x.open("GET", "http://127.0.0.1:8080/job/d2ef3763041956dde500eff003d090e05a71feb7/ws/results.json");
x.send();
document.write(x.responseText);
