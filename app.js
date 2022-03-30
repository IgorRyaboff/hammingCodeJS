const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

console.log('Hamming code by Igor Ryaboff');
console.log('[Operation (encode/decode/quit)] [word length] [message]');
function ask() {
    rl.question('\n> ', ans => {
        let end = m => {
            console.log(m);
            ask();
        }
        let op = ans.split(' ')[0][0];
        let wordLen = +ans.split(' ')[1];
        if (wordLen == 0) wordLen = 2**32;

        switch (op) {
            case 'e': {
                let msg = ans.split(' ')[2];
                if (!msg) return end('!msg');
                let words = splitString(msg, wordLen);
                words = words.map(w => encode(w));
                console.log('\n', words.join(''));
                end('Encode complete');
                break;
            }
            case 'd': {
                let msg = ans.split(' ')[2];
                if (!msg) return end('!msg');
                let wholeLen = wordLen + getControlBitsIndexes(wordLen).length;
                let words = splitString(msg, wholeLen);

                let erridxs = [];
                words.forEach((w, wi) => {
                    let errs = getErrors(w);
                    if (!errs.length) return end('No errors');
                    let idx = 0;
                    errs.forEach(i => {
                        idx += +i + 1 + wholeLen * wi;
                    });
                    erridxs.push(idx);
                });
                if (erridxs.length) console.log(`Errors at indexes: ${erridxs.join(', ')}`);
                else console.log('No errors :)');

                end('Decode complete');
                break;
            }
            case 'q': {
                process.exit(0);
            }
            default: {
                end('Unknown operation');
                break;
            }
        }
    });
}

function splitString(string, size) {
    let re = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
}

function getControlBitsIndexes(len) {
    let r = [];
    for (let i = 0; true; i++) {
        let idx = 2 ** i;
        if (idx > len) break;
        else {
            r.push(idx - 1);
            len++;
        }
    }
    return r;
}

/** @param {string} word */
function encode(word) {
    let controlIdxs = getControlBitsIndexes(word.length);
    let i = 0;
    let wordIdx = 0;
    let modifWord = '';
    while (true) {
        if (controlIdxs.indexOf(i) != -1) modifWord += '0';
        else {
            modifWord += word[wordIdx];
            wordIdx++;
            if (wordIdx >= word.length) break;
        }
        i++;
    }
    console.log(modifWord);
    let controlBits = calculateControlBits(modifWord, controlIdxs);
    console.log(controlBits);
    modifWord = [...modifWord];
    for (let i in controlBits) modifWord[i] = controlBits[i] ? '+' : '-';
    return modifWord.join('');
}

/** @param {string} word */
function getErrors(word) {
    let controlBits = calculateControlBits(word);
    let r = [];
    for (let i in controlBits) {
        if (controlBits[i] != (word[i] == '+' || word[i] == '1')) r.push(i);
    }
    return r;
}

function calculateControlBits(word, idxs) {
    if (!idxs) {
        idxs = [];
        for (let i = 0; true; i++) {
            if (word[2**i - 1]) idxs.push(2**i - 1);
            else break;
        }
    }
    console.log(idxs);
    let r = {};
    idxs.forEach(i => {
        r[i] = false;
    });
    idxs.forEach(c => {
        for (let i = c; i < word.length; i += (c + 1) * 2) {
            for (let j = i; j < i + c + 1; j++) {
                if (idxs.indexOf(j) == -1 && word[j] == '1') r[c] = !r[c];
            }
        }
    });
    return r;
}

ask();