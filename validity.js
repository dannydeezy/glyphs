
const { SYMBOL_SCHEMES } = require('./constants')

function isXSymmetrical(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const reverseLine = line.split('').reverse().join('')
        if (line !== reverseLine) {
            return false
        }
    }
    return true
}

function isYSymmetrical(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const reverseLine = lines[lines.length - 1 - i]
        if (line !== reverseLine) {
            return false
        }
    }
    return true
}

function isXYSymmetrical(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const reverseLine = lines[lines.length - 1 - i].split('').reverse().join('')
        if (line !== reverseLine) {
            return false
        }
    }
    return true
}

function isValidGlyph(glyphStr) {
    if (glyphStr.length !== (64 * 64 + 63)) { // 64x64 grid + 63 newlines
        console.log(`Invalid length: ${glyphStr.length}`)
        return false
    }
    const lines = glyphStr.split('\n')

    const possibleSchemes = [true, true, true, true, true, true, true, true, true, true]
    for (let si = 0; si < SYMBOL_SCHEMES.length; si++) {
        const scheme = SYMBOL_SCHEMES[si]
        for (const line of lines) {
            if (line.length !== 64) {
                console.log(`Invalid line length: ${line.length}`)
                return false
            }
            for (const char of line) {
                // Need to check if part of valid symbol set
                if (!scheme.includes(char)) {
                    possibleSchemes[si] = false
                }
            }
        }
    }
    if (possibleSchemes.filter(it => it).length === 0) {
        console.log('Does not match any valid symbol schemes')
        return false
    }    

    // At this point we need to know if the y values pass this check
    if (!isXSymmetrical(lines) && !isYSymmetrical(lines) && !isXYSymmetrical(lines)) {
        console.log('Not symmetrical in any way')
        return false
    }

    return true
}

module.exports = { isValidGlyph}