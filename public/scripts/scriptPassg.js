
let meuDom = document.querySelectorAll("#list_passengers_li")
meuDom.forEach(el => {

    let item = el.children[1].children[1].innerHTML.replace("CATEGORIA:", "");

    function cardVip() {
        let cardItem = document.createElement("img");
        cardItem.setAttribute("id", "card-vip");
        let container = el.children[0];
        cardItem.src = "./cards/cards_arts_vip.png";
        container.appendChild(cardItem);
    }

    
    switch (item) {
        case ' basic':
            el.style.background = "rgba(170, 170, 170, 0.4);"
            break
        case ' normal':
            el.style.background = "rgba(101, 206, 255, 0.5)";
            el.style.border = "solid 1px white"
            break
        case " VIP":
            cardVip();
            el.style.background = "none";
            break
        case " premium":
            el.style.background = "rgba(55, 233, 159, 0.7)";
            el.style.border = "solid 3.5px white"
            break
    }
})
