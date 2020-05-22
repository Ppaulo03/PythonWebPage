var cores = {
    "espadas": "preto",
    "paus": "preto",
    "copas": "vermelho",
    "ouros": "vermelho"
}

var ordem = {
    "1": "0",
    "2": "1",
    "3": "2",
    "4": "3",
    "5": "4",
    "6": "5",
    "7": "6",
    "8": "7",
    "9": "8",
    "10": "9",
    "11": "10",
    "12": "11",
    "13": "12",
    null: "13"
}

function getName(item) {
    nome = item.getAttribute('name');
    nome = nome.slice(1, -1).split(', ')
    nome[0] = nome[0].slice(1, -1)
    return nome
}

function compareCards(card1, card2) {
    return ordem[card1[1]] == card2[1] && cores[card1[0]] != cores[card2[0]]
}

var win = ["('copas', 13)", "('espadas', 13)", "('ouros', 13)", "('paus', 13)"];
var draw_cont = 0;
var cards_in_mont = new Array();
var actual = null;
var last_card = null

function draw_card() {

    if (draw_cont == cards_in_mont.length) {
        while (draw_cont > 0) {
            draw_cont--;
            var card = cards_in_mont[draw_cont];
            card.style.top = (cards_in_mont.length - draw_cont) + "px";
            card.style.visibility = "visible";
            card.setAttribute("onclick", "draw_card()")
            card.children[0].setAttribute("src", "./static/assets/images/Deck/verso.png");
        }

        draw_cont = 0;
        actual = null;
        last_card = null
    }

    else {
        if (actual != null) {
            actual.style.visibility = 'hidden'
        }

        last_card = actual
        var card = cards_in_mont[draw_cont]
        card.style.top = "15rem";
        card.setAttribute("onclick", "")
        card.setAttribute("draggable", "true")


        var naming = getName(card.children[0]);
        var url = "./static/assets/images/Deck/" + naming[1] + naming[0] + ".png";
        card.children[0].setAttribute("src", url);

        card.children[1].setAttribute("draggable", "true");

        actual = card
        draw_cont++;
    }

}

function allowDrop(ev) {
    if (ev.target.getAttribute("droppable") == "false") {
        ev.dataTransfer.dropEffect = "none"; // dropping is not allowed
    }
    ev.preventDefault();

}

function drag(ev) {

    if (ev.target.getAttribute("draggable") == "false") {
        ev.dataTransfer.setData("text", null);
    }

    else if (ev.target.children.length == 0) {
        ev.dataTransfer.setData("text", ev.target.parentElement.id);

    }

    else if (ev.target.children[0].getAttribute("data-hid") == "true") {
        ev.dataTransfer.setData("text", "null");
    }

    else {
        var ordenado = true;
        var id = "[id='" + ev.target.id + "'] .card-sp";
        var children = document.querySelectorAll(id);

        for (var i = 0; i < children.length - 1; ++i) {

            var name1 = getName(children[i])
            var name2 = getName(children[i + 1])

            if (compareCards(name1, name2)) {
                var ordenado = true;
            }

            else {
                var ordenado = false;
                break;
            }

        }
        if (ordenado) ev.dataTransfer.setData("text", ev.target.id);
        else ev.dataTransfer.setData("text", "null");
    }
}

function drop(ev) {
    ev.preventDefault();

    if (ev.target.getAttribute("droppable") == "false") return

    var data = ev.dataTransfer.getData("text");
    if (data == "null") return;

    var id = "[id='" + data + "']";
    var card2 = document.querySelector(id);
    card2 = card2.querySelector('img[class="card-sp"]');
    var card2_name = getName(card2);

    if (ev.target.getAttribute("id") == "base") {

        var card1_name = getName(ev.target);
        if (ordem[card2_name[1]] == card1_name[1] && card1_name[0] == card2_name[0]) {

            if (cards_in_mont.indexOf(card2.parentElement) != -1) {

                cards_in_mont.splice(cards_in_mont.indexOf(card2.parentElement), 1);

                card2.parentElement.style = null;
                card2.parentElement.children[1].setAttribute("droppable", "true");
                card2.style.width = 100 + "%";

                if (last_card != null) {
                    last_card.style.visibility = 'visible';
                }
                draw_cont--;
                actual = last_card;
                last_card = cards_in_mont[(draw_cont - 2)];

            }

            else {

                children = card2.parentElement.parentElement.parentElement.children;
                if (children[0].getAttribute("data-hid") == "true") {
                    naming = getName(children[0]);
                    url = "./static/assets/images/Deck/" + naming[1] + naming[0] + ".png";
                    children[0].setAttribute("data-hid", "false");
                    children[0].setAttribute("src", url);
                }
            }

            if (card2.parentElement.children[1] != null) {
                card2.parentElement.children[1].remove();
            }

            card2.parentElement.setAttribute("draggable", "false");
            card2.setAttribute("id", "base");
            card2.setAttribute("draggable", "false");
            card2.setAttribute("droppable", "true");
            card2.setAttribute("ondragstart", "drag(event)");
            card2.setAttribute("ondrop", "drop(event)");
            card2.setAttribute("ondragover", "allowDrop(event)");

            var string_card = card2.getAttribute("name");
            for (var num = 0; num < win.length; num++) {
                if (win[num] == string_card) {
                    console.log('herr');
                    win.splice(num, 1);
                    console.log(num);
                    break;
                }
            }
            if (win.length == 0) {
                alert("Parabéns, você venceu");
                win = ["That's all"];
            }

            if (ev.target.parentElement != null) {
                ev.target.parentElement.appendChild(document.getElementById(data))
                ev.target.remove();
            }
        }

    }
    else {
        if (ev.target.getAttribute('class') == 'base') {
            var card1 = [null, null];
        }

        else {
            var id = "[id='" + ev.target.parentElement.id + "']"
            var card1 = document.querySelector(id);
            card1 = card1.querySelector('img[class="card-sp"]');
            card1 = getName(card1);
        }

        if (compareCards(card1, card2_name)) {

            if (cards_in_mont.indexOf(card2.parentElement) != -1) {
                cards_in_mont.splice(cards_in_mont.indexOf(card2.parentElement), 1)

                card2.parentElement.style = null;

                card2.parentElement.children[1].setAttribute("droppable", "true");

                card2.style.width = 100 + "%";

                if (last_card != null) {
                    last_card.style.visibility = 'visible';
                }
                draw_cont--;
                actual = last_card;
                last_card = cards_in_mont[(draw_cont - 2)]

            } else {
                children = card2.parentElement.parentElement.parentElement.children;

                if (children[0].getAttribute("data-hid") == "true") {

                    naming = getName(children[0]);
                    url = "./static/assets/images/Deck/" + naming[1] + naming[0] + ".png";
                    children[0].setAttribute("data-hid", "false");
                    children[0].setAttribute("src", url);

                }
            }

            ev.target.appendChild(document.getElementById(data));
        }
    }
}

function append_cards() {
    for (var fund = 0; fund < 8; fund++) {
        for (var card = 1; card < 8; card++) {
            pai = "row(" + fund + ", " + card + ")";
            filho = "fund(" + fund + ", " + (card + 1) + ")";
            if (document.getElementById(filho) != undefined) {
                document.getElementById(pai).appendChild(document.getElementById(filho));
            }
        }
    }
    for (var i = 23; i >= 0; i--) {
        var card = document.querySelector("[id=drawing]");
        var pos = '[id="draw' + (i + 28) + '"]';
        card = card.querySelector(pos);
        cards_in_mont.push(card)
    }
}
