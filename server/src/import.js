const cheerio = require('cheerio')
const fs = require('fs')

const path = 'storage/hdm_export/'
const hdmModule = {}

fs.readdir(path, function(err, files) {
    for (let i = 0; i < files.length; i++) {
        const fileParts = files[i].split('_')
        const studies = fileParts[0]
        const sort = fileParts[1].substring(0, fileParts[1].length - '.html'.length)

        const body = fs.readFileSync(path + files[i], 'utf8');
        const $ = cheerio.load(body)
        const tableRows = $('table tr:not(:first-child, :nth-child(2), :nth-child(3))')

        if (!(studies in hdmModule)) {
            hdmModule[studies] = []
        }

        tableRows.each(function() {
            const hdmModul = {
                edvNr: $(this).find('td').eq(0).html().trim(),
                studies: studies,
                sort: sort,
                name: $(this).find('td').eq(1).html().trim(),
                ects: parseInt($(this).find('td').eq(2).html().trim())
            }
            if (!hdmModule[studies].some(l => l.edvNr === hdmModul.edvNr)) {
                hdmModule[studies].push(hdmModul)
            }

            if (hdmModul.edvNr === "114190") {
                console.log(body)
            }
        });
    }

    fs.writeFile('storage/hdm-module.json', JSON.stringify(hdmModule), 'utf8', function() {
        console.log('Import succeed')
    });
})

