import "./css/index.css"
import IMask from 'imask';

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");


function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#CF6F29", "#C69347"],
        elo: ["#436D99", "#F22D2D"],
        default: ["black", "gray"],
    }

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);

    ccLogo.setAttribute("src", `cc-${type}.svg`);
    //setAttribute (atributoParaModificar, valor)
}

globalThis.setCardType = setCardType;
//adicionando função em nível global

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
    mask: "MM{/}YY",

    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
    }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = {
    //visa inicia com quatro e pode ter de 0 até 15 digitos
    /*mastercard inicia com 5, proximo digito é entre 1 e 5, aceita digitos entre 0 até 2 digitos 
    OU inicia com 22, proximo digito é entre 2 e 9 e pode ter mais um digito 
    OU inicia com 2, proximo digito vai entre 3 e 7, tem entre 0 e dois digitos depois
    se passar tudo isso, vai entre 0 e 12 digitos depois*/

    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^1\d{0,15}/,
            cardtype: "elo",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        },
    ],

    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        //tudo o que não é digito se torna vazio
        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        return foundMask
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector('#add-card');

addButton.addEventListener("click", () => {
    alert('Cartão adicionado!');
});

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
})

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector('.cc-holder .value');

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANA DA SILVA" : cardHolder.value;
});

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})
//.on observa o conteúdo do input
//quero capturar o conteudo quando ele é aceito

function updateSecurityCode(code){
    const ccSecurity = document.querySelector('.cc-security .value');

    ccSecurity.innerText = code.length === 0 ? "1234" : code;
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype;
    setCardType(cardType);
    updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number){
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number;
}

expirationDateMasked.on("accept", () => {
    updateExpirationDateMasked(expirationDateMasked.value);
})

function updateExpirationDateMasked(date){
    const ccExpiration = document.querySelector('.cc-extra .value');
    ccExpiration.innerText = date.length === 0 ? "01/32" : date;
}