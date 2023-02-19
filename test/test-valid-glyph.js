const { isValidGlyph } = require('../validity')

const fs = require('fs')
const exampleFolder = './generated-examples'
const examples = fs.readdirSync(exampleFolder)
const exampleFiles = examples.map(it => `${exampleFolder}/${it}`)

for (const glyphFile of exampleFiles) {
    let glyph = fs.readFileSync(glyphFile, 'utf8')
    //console.log(glyph)
    console.log(`Testing glyph: ${glyphFile}`)
    if (isValidGlyph(glyph)) {
        //console.log(`Valid glyph: ${glyphFile}\n`)
    } else {
        console.log(`----- ---- --- --- Invalid glyph: ${glyphFile} ----- - -- -------- \n`)
    }
}