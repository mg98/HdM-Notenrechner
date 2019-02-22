const cheerio = require('cheerio')
const fs = require('fs')

const path = 'storage/hdm_export/'
const hdmModule = {}

fs.readdir(path, function(err, files) {
    for (let i = 0; i < files.length; i++) {
        const fileParts = files[i].split('_')
        const studies = fileParts[0]
        const sort = fileParts[1].substring(0, fileParts[1].length - '.html'.length)

        const body = fs.readFileSync(path + files[i], {encoding: 'utf8'});
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
                ects: parseInt($(this).find('td').eq(2).html().trim()),
                name: $(this).find('td').eq(1).html().trim()
                    /* temporary fix for utf8 bug */
                    .replace('&#xE4;', 'ä').replace('&#xC4;', 'Ä')
                    .replace('&#xF6;', 'ö').replace('&#xD6;', 'Ö')
                    .replace('&#xFC;', 'ü').replace('&#xDC;', 'Ü').replace('&#xFFFD;', 'ü')
            }
            if (!hdmModule[studies].some(l => l.edvNr === hdmModul.edvNr)) {
                hdmModule[studies].push(hdmModul)
            }
        });
    }

    fs.writeFile('storage/hdm-module.json', JSON.stringify(hdmModule), 'utf8', function (err) {
        if (err) {
            console.log('Import error!', err)
        } else {
            console.log('Import succeed')
        }
    });
})

