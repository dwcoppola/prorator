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
    const remainder = available - sumNewCases(obj)  
    for (let key in obj) {
        obj[key]['newQty'] = obj[key]['newQty'] * casepack;
    }
    obj['remainder'] = remainder;
    return obj;
}

function returnInfoToUser(obj, casepack) {
    const userData = document.getElementById('userData');
    userData.value = '';
    let output = '';
    for (key in obj) {
        if (key === 'remainder') {
            // Do nothing
        } else {
            output += `${obj[key].orderNumber}\t${obj[key].newQty}\n`
        }
    }
    output += `\nNOTE: You have ${obj['remainder'] * casepack} pieces (${obj['remainder']} cases) left over to put anywhere.`
    userData.value = output;
}

function prorate() {
    const userData = document.getElementById('userData').value;
    const casepack = document.getElementById('casepack').value;
    const available = document.getElementById('available').value / casepack;
    const data = parseUserInput(userData);
    const objectData = objectifyUserInput(data, casepack);
    const final = finalizeProrate(objectData, available, casepack);
    returnInfoToUser(final, casepack);
}

