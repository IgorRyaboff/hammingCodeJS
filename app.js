const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

console.log('Hamming code by Igor Ryaboff');
console.log('[Operation] [word length] [message]');
function ask() {
    rl.question('\n> ', ans => {
        let op = +ans.split(' ')[0];
        let wordLen = +ans.split(' ')[1];
        let msg = ans.split(' ')[2];
        if (!msg || !wordLen /** TODO проверка что длина слова - степень двойки */ || (op != 0 && op != 1)) return console.log('Poshel v les');
    });
}

function getControlBits(msg) {
    if (!Array.isArray(msg)) msg = [...msg];
    for (let i = 0; i < )
}