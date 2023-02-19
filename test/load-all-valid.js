const axios = require('axios')
const fs = require('fs')
async function run() {
    for (let i = 1; i <= 512; i++) {
        console.log(`Loading glyph ${i}...`)
        const resp = await axios.get(`https://www.larvalabs.com/autoglyphs/rawglyph?index=${i}`, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            }
        })
        const { data } = resp
        //console.log(data)
        const text = data.split('pre')[1].replace('>', '').replace('</', '').trim()
        fs.writeFileSync(`./examples/${i}.txt`, text)
        //console.log(text)
    }
}

run()