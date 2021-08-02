//  error checking
//      available must be < sum of input
//      each qty must be divisible by casepack, i.e. % should equal 0

function getData() {
    const dataDump = document.getElementById('dataDump').value;
    const splitDump = dataDump.split('\n');
    const splitLines = splitDump.map(v => v.split('\t'));
    output = {};
    for (line of splitLines) {
        if (line[0] !== '') {
            output[line[0]] = Number(line[1])
        }
    }
    return output;
}

function listifyObject(object) {
    output = [];
    for (key in object) {
        output.push(object[key]);
    }
    return output;
}

function prorate(list, casepack, available) {
    const cartonsAvailable = available / casepack;
    const convertToCartons = function(list, casepack) {
        output = [];
        list.map(v => output.push(v / casepack));
        return output;    
    }
    const sum = function(list) {
        output = 0;
        list.map(v => output += v);
        return output;
    }
    const percentage = Math.round(cartonsAvailable / sum(convertToCartons(list, casepack)) * 100, 0) / 100;
    const prorateEstimate = convertToCartons(list, casepack).map(v => Math.round(v * percentage));
    const amountOverOrUnder = sum(prorateEstimate) - cartonsAvailable;
    const adjust = function(list, offset) {
        output = [];
        // adjust down
        tracker = offset;
            for (item of list) {
                if (item === Math.max(...list) && tracker !== 0) {
                    output.push(item - offset);
                    tracker -= 1;
                } else {
                    output.push(item);
                }
            }
        return output;
    }
    const adjustedProrate = adjust(prorateEstimate, amountOverOrUnder);
    const convertBackToPieces = adjustedProrate.map(v => v * casepack);
    return convertBackToPieces;
}
