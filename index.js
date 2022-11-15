const COLORS = {
    red: [0, 100],
    blue: [239, 25],
    yellow: [59, 100],
    green: [124, 33],
    brown: [36, 10],
    orange: [37, 100],
    pink: [260, 100],
    black: [0,0]
}

function createRow(color, index) {
    var el = document.createElement('div');
    el.setAttribute('class', 'pawnProgress');

    var imgContainer = document.createElement('div');
    imgContainer.setAttribute("class", "imgContainer");

    var img = document.createElement('img');
    img.setAttribute("width", 64);
    img.setAttribute("src", "pawn.png");
    img.setAttribute("class", "pawnImg");
    img.setAttribute("style", `filter: sepia(100%) hue-rotate(${COLORS[color][0] + 313}deg) brightness(${COLORS[color][1]}%) saturate(2000%)`);
    imgContainer.appendChild(img);
    el.appendChild(imgContainer)

    var percentText = document.createElement('span');
    percentText.setAttribute("id", "percentText-" + index);
    percentText.innerText = percentages[index] + "%"

    var percentWrapper = document.createElement("div");
    percentWrapper.setAttribute("class", "percentWrapper")   
    percentWrapper.appendChild(percentText);
    el.appendChild(percentWrapper)

    var bar = document.createElement("div");
    bar.setAttribute("class", "bar");
    bar.setAttribute("id", "bar-" + index);
    bar.innerHTML = "<img>"
    el.appendChild(bar);


    return el;
}

var colorOrder = ["red", "blue", "yellow", "green", "brown", "orange", "pink", "black"];
var percentages = [0,25,50,100,0,25,50,100];

for (let i = 0; i < colorOrder.length; i++) {
    document.getElementById("progressBars").innerHTML += createRow(colorOrder[i], i).outerHTML
}
