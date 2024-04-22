// script file for freecodecamp
// start of code provided by freeCodeCamp
let price = 1.87;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];
// end of code provided by freeCodeCamp

const priceEl = document.getElementById('price');
priceEl.innerHTML += `$${price}`;
const paymentInput = document.getElementById('cash');
const payBtn = document.getElementById('purchase-btn');
const changeDueDiv = document.getElementById('change-due');
const showDollarValueBtn = document.getElementById('show-dollar-value-btn');
const valuesDialog = document.getElementById('values-dialog');
const valuesDialogCloseBtn = document.getElementById('values-dialog-close');

const displayError = errorMsg => {
    const errorMsgExists = document.querySelector('.errorMsg');
    if (errorMsgExists) return;

    const errorMsgEl = document.createElement('span');
    errorMsgEl.textContent = errorMsg;
    errorMsgEl.classList.add('error');
    errorMsgEl.classList.add('errorMsg');

    const inputDiv = document.getElementById('input');

    inputDiv.parentNode.insertBefore(errorMsgEl, inputDiv.nextSibling);

    setTimeout(() => {
        errorMsgEl.remove();
    }, '3000');
}

const updateCashRegister = (cid) => {
    const units = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.1,
        "QUARTER": 0.25,
        "ONE": 1,
        "FIVE": 5,
        "TEN": 10,
        "TWENTY": 20,
        "ONE HUNDRED": 100
    };
    // every unit value in an array
    const unitValues = Object.values(units);
    // counts of every unit in cid array
    let unitCounts = cid.map((unit, i = 0) => parseFloat(unit[1] / unitValues[i]).toFixed(0));

    const currencyCountCells = [...document.querySelectorAll('.currency-count')];
    currencyCountCells.forEach((cell, i = 0) => {
        cell.textContent = unitCounts[i];
    });

    const amountLeftCells = [...document.querySelectorAll('.amount-left')];
    amountLeftCells.forEach((cell, i = 0) => {
        cell.textContent = parseFloat(cid[i][1]).toFixed(2);
    });

    const totalAmountLeftSpan = document.getElementById('total-amount-left');
    let totalCashInRegister = cid.map(unit => parseFloat(unit[1]))
        .reduce((acc, e) => acc + e, 0)
        .toFixed(2);
    totalAmountLeftSpan.textContent = `$${totalCashInRegister}`;
}

const calcChangeBreakdown = (cash, price, cid) => {
    const units = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.1,
        "QUARTER": 0.25,
        "ONE": 1,
        "FIVE": 5,
        "TEN": 10,
        "TWENTY": 20,
        "ONE HUNDRED": 100
    };
    // every unit value in an array
    const unitValues = Object.values(units);
    // counts of every unit in cid array
    let unitCounts = cid.map((unit, i = 0) => parseFloat(unit[1] / unitValues[i]).toFixed(0));

    let change = parseFloat((cash - price).toFixed(2));

    let totalCashInRegister = cid.map(unit => parseFloat(unit[1]))
        .reduce((acc, e) => acc + e, 0)
        .toFixed(2);

    if (totalCashInRegister < change) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    let result = parseFloat(totalCashInRegister) === parseFloat(change) ? "Status: CLOSED" : "Status: OPEN";

    for (let i = cid.length - 1; i >= 0; i--) {
        const unit = cid[i][0];
        const amount = cid[i][1];

        if (amount === 0) continue;

        const availableChange = Math.min(Math.floor(change / units[unit]), unitCounts[i]);

        if (availableChange > 0) {
            result += `\n${unit}: $${parseFloat(availableChange * units[unit]).toFixed(2)}`;
            change = parseFloat(change - (availableChange * units[unit])).toFixed(2);
            cid[i][1] = parseFloat(amount - (availableChange * units[unit])).toFixed(2);
            unitCounts[i] -= availableChange;
        }

        if (parseFloat(change) === 0) break;
    }

    if (change > 0) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    changeDueDiv.textContent = result;
    updateCashRegister(cid);
}

const checkInput = e => {
    e.preventDefault();
    const inputRegex = /^\d+(\.\d{1,2})?$/g;
    if (!inputRegex.test(paymentInput.value)) {
        displayError("Invalid input. Please try again.");
        paymentInput.value = "";
    } else if (parseFloat(paymentInput.value) < price) {
        alert("Customer does not have enough money to purchase the item");
        paymentInput.value = "";
    } else if (parseFloat(paymentInput.value) === price) {
        changeDueDiv.textContent = "No change due - customer paid with exact cash";
    } else {
        calcChangeBreakdown(paymentInput.value, price, cid);
    }
}

payBtn.addEventListener('click', checkInput);

showDollarValueBtn.addEventListener('click', () => {
    valuesDialog.style.display = "flex";
    valuesDialog.showModal();
});
valuesDialogCloseBtn.addEventListener('click', () => {
    valuesDialog.close();
    valuesDialog.style.display = "none";
});

updateCashRegister(cid);