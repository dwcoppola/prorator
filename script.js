function getUserData() {
    return document.getElementById('userDate').value;
}

function parseUserInput(str) {
    let output = [];
    for (line of str.split('\n')) {
        if (line !== '') {
            output.push(line.split('\t')[0])
            output.push(Number(line.split('\t')[1]))
        }
    }
    return output;
}

function objectifyUserInput(list, casepack){
    let orders = {};
    let c = 1;
    for (let i in list) {   
        if (i % 2 === 0) {
            orders[`order-${c}`] = {}
            orders[`order-${c}`]['orderNumber'] = list[i];
            orders[`order-${c}`]['origEaches'] = list[Number(i) + 1];
            orders[`order-${c}`]['origCases'] = list[Number(i) + 1] / casepack;
            orders[`order-${c}`]['newQty'] = undefined;
            c++;
        } else {
            continue;
        }
    }    
    return orders;
}

function sum(obj) {
    let output = 0;
    for (let key in obj) {
        output += obj[key]['origCases'];
    }
    return output;
}

function finalizeProrate(obj, available, casepack) {
    const percentage = available / sum(obj);
    const sumNewCases = function(obj) {
        let output = 0;
        for (let key in obj) {
            output += obj[key]['newQty'];
        }
        return output;
    } 
    for (let key in obj) {
        obj[key]['newQty'] = Math.floor(obj[key]['origCases'] * percentage);
    }
    if (available > sumNewCases(obj)) {
        for (i = 0; i < available - sumNewCases(obj); i++) {
            obj[`order-${Number(i) + 1}`][`newQty`] = obj[`order-${Number(i) + 1}`][`newQty`] + 1; 
        }
    }
    for (let key in obj) {
        obj[key]['newQty'] = obj[key]['newQty'] * casepack;
    }
    return obj;
}

function prorate() {
    const userData = document.getElementById('userData').value;
    const casepack = document.getElementById('casepack').value;
    const available = document.getElementById('available').value / casepack;
    const data = parseUserInput(userData);
    const objectData = objectifyUserInput(data, casepack);
    const final = finalizeProrate(objectData, available, casepack);
    console.log(final);
}