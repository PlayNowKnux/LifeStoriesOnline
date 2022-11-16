Array.prototype.shuffle = function() {
    var j, x, i;
    for (i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randint(min, max) {
    return Math.round(random(min, max));
}

function outof(l, m) {
    // return true l out of m times
    let n = randint(1, m);
    return n < l + 1;
}

var screen = "game";

const COLORS = {
    red: [0, 50, 100, 50],
    blue: [239, 25, 100, 25],
    yellow: [59, 100, 100, 50],
    green: [124, 33, 75, 33],
    brown: [36, 10, 100, 15],
    orange: [37, 100, 100, 50],
    pink: [260, 100, 50, 75],
    black: [0,0, 0, 0]
}

const TEMP_CARDS = {
    "alternatives": [...alternatives],
    "etchings": [...etchings],
    "memories": [...memories],
    "valuables": [...valuables],
}

var cards = {
    "alternatives": [...alternatives].shuffle(),
    "etchings": [...etchings].shuffle(),
    "memories": [...memories].shuffle(),
    "valuables": [...valuables].shuffle(),
}

const TYPE_VALS = ['valuables', 'etchings', 'memories', 'alternatives', 'alternatives']

function pull_card(t) {
    
    var tp = TYPE_VALS[t];
    if (cards[tp].length == 0) {
        cards[tp] = TEMP_CARDS[tp].shuffle();
    } else {
        if (t < 3) {
            return cards[tp].shift();
        } else {
            return cards["alternatives"].shift()
        }
    }
}

function createProgressGradient(clr, percentage) {
    color = COLORS[clr]
    hue = (color[0]) % 360
    sat = color[2]
    bri = color[3]
    return `linear-gradient(to right, hsl(${hue}, ${sat}%, ${bri}%), hsl(${hue}, ${sat}%, ${bri}%) ${percentage}%, white ${percentage}%, white 100%)`
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
    let p = percentages[index] / 30;
    p = p.toFixed(1) * 100;
    percentText.setAttribute("id", "percentText-" + index);
    percentText.innerText = p + "%"

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



function switchScreen(scrn) {
    document.getElementById(screen).style.display = "none";
    document.getElementById(scrn).style.display = "block";
    screen = scrn;

    switch (screen) {
        case "game":
            player++;
            if (player >= colorOrder.length) {
                player = 0;
            }
            document.body.style.backgroundColor = "white";
            spawnPieces();
            break;
        case "status":
            //document.body.style.backgroundColor = `hsl(${COLORS[colorOrder[player]][0]}, ${COLORS[colorOrder[player]][2]}%, ${COLORS[colorOrder[player]][3] - 30}%)`;
            document.getElementById("message").innerHTML = ""
            document.getElementById("card").innerHTML = ""

            currentCard = ""
            currentAlt = ""

            let roll = randint(1,6)

            if (outof(2, 29)) {
                type = randint(3,4);
                if (type - 3) {
                    percentages[player] -= 3;
                } else {
                    percentages[player] += 2;
                }
            } else {
                type = randint(0,2);
                percentages[player] += roll
            }

            document.body.style.backgroundColor = `var(--${TYPE_VALS[type]})`
            document.getElementById("reading").style.borderColor = `var(--${TYPE_VALS[type]}-border)`

            document.getElementById("message").innerHTML = `${colorOrder[player].capitalize()} rolled a ${roll}<br>`

            if (percentages[player] >= 30) {
                document.getElementById("message").innerHTML += `${colorOrder[player].capitalize()} wins!!`
            } else if (type < 3) {
                document.getElementById("message").innerHTML += `${colorOrder[player].capitalize()} got a(n) ${TYPE_VALS[type].capitalize()} card!<br>`
                currentCard = pull_card(type)
                document.getElementById("card").innerText = currentCard
            } else if (type == 3) {
                document.getElementById("message").innerHTML += `${colorOrder[player].capitalize()} got to move forward two spaces!`
            } else {
                document.getElementById("message").innerHTML += `${colorOrder[player].capitalize()} had to go back 3 spaces...`
            }
    }

}

var colorOrder = ["red", "blue", "yellow", "green", "brown", "orange", "pink", "black"];
var percentages = [3,8,15,30,3,8,15,30];
var player = 0;
// 0 = valuables, 1 = etchings, 2 = memories, 3 = advance 2, 4 = go back 3
var type = 0;
var currentCard = ""
var currentAlt = ""

function spawnPieces() {
    document.getElementById("progressBars").innerHTML = ""
    for (let i = 0; i < colorOrder.length; i++) {
        let p = percentages[i] / 30;
        p = p.toFixed(1) * 100;
        document.getElementById("progressBars").innerHTML += createRow(colorOrder[i], i).outerHTML
        document.getElementById("bar-" + i).style.background = createProgressGradient(colorOrder[i], p)
    }

    var turnEl = document.createElement("p");
    turnEl.style.textAlign = "center";
    turnEl.style.fontSize = "2vw"
    turnEl.innerText = `It's ${colorOrder[player].capitalize()}'s turn!`
    document.getElementById("progressBars").appendChild(turnEl)

    var rollBtn = document.createElement("button");
    rollBtn.id = "rollBtn";
    rollBtn.innerText = "Roll die";
    rollBtn.setAttribute("onclick", "roll()")

    if (COLORS[colorOrder[player]][3] < 50) {
        rollBtn.style.color = "white";
    } else {
        rollBtn.style.color = "black";
    }

    rollBtn.style.backgroundColor = `hsl(${COLORS[colorOrder[player]][0]}, ${COLORS[colorOrder[player]][2]}%, ${COLORS[colorOrder[player]][3]}%)`;

    document.getElementById("progressBars").appendChild(rollBtn)
}
spawnPieces();

// game stuff

switchScreen("status")


function roll() {
    switchScreen("status")
}