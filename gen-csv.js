const fs = require('fs')

const { lowestGlyphs } = require('./lowest-glyphs.json')

const glyphs = Object.keys(lowestGlyphs)

const orderedGlyphs = glyphs.sort((a, b) => lowestGlyphs[a].num - lowestGlyphs[b].num).slice(0, 512)

let csv = 'Inscription Id,Inscription Number\n'
csv += orderedGlyphs.map(glyph => `${lowestGlyphs[glyph].id},${lowestGlyphs[glyph].num}`).join('\n')

fs.writeFileSync('./glyphs.csv', csv)