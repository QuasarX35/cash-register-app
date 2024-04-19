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
let totalAmountLeft = 0.00;
const showDollarValueBtn = document.getElementById('show-dollar-value-btn');
const valuesDialog = document.getElementById('values-dialog');
const valuesDialogCloseBtn = document.getElementById('values-dialog-close');

const updateCashRegister = () => {
    const currencyCountCells = [...document.querySelectorAll('.currency-count')];
    currencyCountCells.forEach((cell, i = 0) => {
        cell.textContent = unitCounts[i];
    });

    const amountLeftCells = [...document.querySelectorAll('.amount-left')];
    amountLeftCells.forEach((cell, i = 0) => {
        cell.textContent = parseFloat(cid[i][1]).toFixed(2);
    });

    const totalAmountLeftSpan = document.getElementById('total-amount-left');
    totalAmountLeft = cid.map(unit => parseFloat(unit[1]))
        .reduce((acc, e) => acc + e, 0)
        .toFixed(2);
    totalAmountLeftSpan.textContent = `$${totalAmountLeft}`;
}

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

// working attempt 1
const calcChangeBreakdown = change => {
    if (totalAmountLeft < change) {
        return "Status: INSUFFICIENT_FUNDS";
    }

    change = parseFloat(change).toFixed(2);
    let result = "";
    if (totalAmountLeft === change) {
        result = "Status: CLOSED\n";
    } else {
        result = "Status: OPEN\n";
    }

    let count = 0;
    // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
    let tempCid = JSON.parse(JSON.stringify(cid));
    for (let i = cid.length - 1; i >= 0; i--) {
        count = 0;
        while (tempCid[i][1] > 0 && change - unitValues[i] >= 0) {
            change = parseFloat(change - unitValues[i]).toFixed(2);
            tempCid[i][1] = parseFloat(tempCid[i][1] - unitValues[i]).toFixed(2);
            count++;
        }
        if (count > 0) {
            result += `\n${tempCid[i][0]}: $${parseFloat(count * unitValues[i]).toFixed(2)}`;
        }
        if (change === 0) {
            break;
        }
    }
    if (change > 0) {
        return "Status: INSUFFICIENT_FUNDS";
    } else {
        cid = JSON.parse(JSON.stringify(tempCid));
    }
    return result;
}

// attempt 2 - more efficient
const calcChangeBreakdown2 = change => {
    if (totalAmountLeft < change) {
        return "Status: INSUFFICIENT_FUNDS";
    }

    change = parseFloat(change).toFixed(2);
    let result = "";
    if (totalAmountLeft === change) {
        result = "Status: CLOSED\n";
    } else {
        result = "Status: OPEN\n";
    }

    let count;
    let tempCid = JSON.parse(JSON.stringify(cid));
    for (let i = cid.length - 1; i >= 0; i--) {
        count = 0;
        if (tempCid[i][1] > 0) {
            if (change - tempCid[i][1] >= 0) {
                count = parseInt(tempCid[i][1] / unitValues[i]);
                change = parseFloat(change - tempCid[i][1]).toFixed(2);
                tempCid[i][1] = 0;
            } else if (change - unitValues[i] >= 0) {
                count = Math.floor(change / unitValues[i]);
                change = parseFloat(change - (unitValues[i] * count)).toFixed(2);
                tempCid[i][1] = parseFloat(tempCid[i][1] - (unitValues[i] * count)).toFixed(2);
            }
        } else {
            continue;
        }
        if (count > 0) {
            result += `\n${tempCid[i][0]}: $${parseFloat(count * unitValues[i]).toFixed(2)}`;
        }
        if (change === 0) {
            break;
        }
    }
    if (change > 0) {
        return "Status: INSUFFICIENT_FUNDS";
    } else {
        cid = JSON.parse(JSON.stringify(tempCid));
    }
    return result;
}

// most efficient and readable attempt
const calcChangeBreakdown3 = change => {
    if (totalAmountLeft < change) return "Status: INSUFFICIENT_FUNDS";

    change = parseFloat(change).toFixed(2);
    let result = totalAmountLeft === change ? "Status: CLOSED" : "Status: OPEN";

    let tempCid = JSON.parse(JSON.stringify(cid));
    for (let i = cid.length - 1; i >= 0; i--) {
        const unit = cid[i][0];
        const amount = cid[i][1];

        if (amount === 0) continue;

        const availableChange = Math.min(Math.floor(change / unitValues[i]), unitCounts[i]);

        if (availableChange > 0) {
            result += `\n${unit}: $${parseFloat(availableChange * unitValues[i]).toFixed(2)}`;
            change = parseFloat(change - (availableChange * unitValues[i])).toFixed(2);
            tempCid[i][1] = parseFloat(amount - (availableChange * unitValues[i])).toFixed(2);
            unitCounts[i] -= availableChange;
        }

        if (change === 0) break;
    }

    if (change > 0) return "Status: INSUFFICIENT_FUNDS";
    else cid = tempCid.slice();
    return result;
}

const displayChange = paymentAmt => {
    let resultStr = "";
    const change = parseFloat((paymentAmt - price).toFixed(2));
    document.querySelector('#display-section h2').innerHTML = `<i class="fa-regular fa-money-bill-1"></i>Change Due: $${change}`;
    changeDueDiv.textContent = calcChangeBreakdown3(change);
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
        displayChange(paymentInput.value);
        updateCashRegister();
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

updateCashRegister();