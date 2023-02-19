const fs = require('fs')
const { SYMBOL_SCHEMES } = require('./constants')
const crypto = require('crypto')

const ONE = 4294967296
const MAX_A = ONE * 2
function getScheme(a) {
    let index = a % 83
    let scheme
    if (index < 20) {
        scheme = 1;
    } else if (index < 35) {
        scheme = 2;
    } else if (index < 48) {
        scheme = 3;
    } else if (index < 59) {
        scheme = 4;
    } else if (index < 68) {
        scheme = 5;
    } else if (index < 73) {
        scheme = 6;
    } else if (index < 77) {
        scheme = 7;
    } else if (index < 80) {
        scheme = 8;
    } else if (index < 82) {
        scheme = 9;
    } else {
        scheme = 10;
    }
    return scheme
}

const SIZE = 64
const HALF_SIZE = SIZE / 2

function int(val) {
    return val - (MAX_A / 2)
}

function uint(val) {
    return Math.abs(val + MAX_A / 2)
}

function draw(a) {
    let output = new Uint8Array(SIZE * (SIZE + 3))
    let c = 0
    let x = 0;
    let y = 0;
    let v = 0;
    let value = 0;
    let mod = (a % 11) + 5;
    let symbols;
    const schemeId = getScheme(a)
    if (schemeId == 0) {
        throw new Error("Invalid symbol scheme.");
    } else if (schemeId == 1) {
        symbols = 0x2E582F5C2E; // X/\
    } else if (schemeId == 2) {
        symbols = 0x2E2B2D7C2E; // +-|
    } else if (schemeId == 3) {
        symbols = 0x2E2F5C2E2E; // /\
    } else if (schemeId == 4) {
        symbols = 0x2E5C7C2D2F; // \|-/
    } else if (schemeId == 5) {
        symbols = 0x2E4F7C2D2E; // O|-
    } else if (schemeId == 6) {
        symbols = 0x2E5C5C2E2E; // \
    } else if (schemeId == 7) {
        symbols = 0x2E237C2D2B; // #|-+
    } else if (schemeId == 8) {
        symbols = 0x2E4F4F2E2E; // OO
    } else if (schemeId == 9) {
        symbols = 0x2E232E2E2E; // #
    } else {
        symbols = 0x2E234F2E2E; // #O
    }
    for (let i = 0; i < SIZE; i++) {
        y = (2 * (i - HALF_SIZE) + 1);
        if (a % 3 == 1) {
            y = -y;
        } else if (a % 3 == 2) {
            y = Math.abs(y);
        }
        y = y * a;
        for (let j = 0; j < SIZE; j++) {
            x = (2 * (j - HALF_SIZE) + 1);
            if (a % 2 == 1) {
                x = Math.abs(x);
            }
            x = x * a;
            v = uint(x * y / ONE) % mod;
            if (v < 5) {
                value = symbols >> 8 * (4 - v) & 0xff;
            } else {
                value = 0x2E;
            }
            output[c] = value;
            c++;
        }
        output[c] = 0x25;
        c++;
        output[c] = 0x30;
        c++;
        output[c] = 0x41;
        c++;
    }
    let result = new TextDecoder().decode(output);
    return decodeURI(result)
}

function generate(a) {
    const schemeId = getScheme(a)
    const symbols = SYMBOL_SCHEMES[schemeId - 1]
    let str = ''
    let x = 0
    let y = 0
    let v = 0
    let mod = (a % 11) + 5
    for (let i = 0; i < SIZE; i++) {
        y = (2 * (i - HALF_SIZE) + 1);
        if (a % 3 == 1) {
            y = -y;
        } else if (a % 3 == 2) {
            y = Math.abs(y);
        }
        //y = y * int(a)
        y = y * a

        for (let j = 0; j < SIZE; j++) {
            x = (2 * (j - HALF_SIZE) + 1);
            if (a % 2 == 1) {
                x = Math.abs(x)
            }
            x = x * a
            v = uint(Math.round(x * y / ONE)) % mod
            //console.log(v)
            //v = Math.abs(v)
            //v = v - 5
            //v = Math.abs(v) % 5
            if (v < 5) {
                value = symbols[v];
            } else {
                //console.log(v)
                value = '.';
            }
            str += value
        }
        str += '\n'
    }
    return str.trim()
}

for (let i = 0; i < 2000; i++) {
    //const a = Math.floor(Math.random() * MAX_A)
    let a = crypto.createHash('sha256').update(`${Math.random()}`).digest('hex').slice(0, 10)
    a = parseInt(a, 16)
    const glyph = generate(Math.floor(Math.random() * MAX_A))
    //const glyph = draw(a)
    fs.writeFileSync(`./test/generated-examples/${a}.txt`, glyph)
}
