const http = require('http');
const request = require('request')
const cheerio = require('cheerio')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const hdmModule = require('../storage/hdm-module')

const log4js = require('log4js')
log4js.configure({
    appenders: { default: { type: 'file', filename: 'server.log' } },
    categories: { default: { appenders: ['default'], level: 'debug' } }
});
const log = log4js.getLogger('default')

const port = 3000

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

log.debug('Creating server')

app.post('/api', (req, res) => {
    const options = {
        followAllRedirects: true,
        method: 'POST',
        url: 'https://vw-online.hdm-stuttgart.de/qisserver/rds',
        qs:
            { state: 'user',
                type: '1',
                category: 'auth.login',
                startpage: 'portal.vm',
                breadCrumbSource: 'portal',
                asdf: req.body.username,
                fdsa: req.body.password },
        headers:
            { 'Postman-Token': 'af6448c8-46e5-4ae7-883b-d456ec1b532a',
                'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        const $ = cheerio.load(body);
        const pruefungsverwaltungUrl = $('#makronavigation > ul > li:nth-child(3) a').attr('href')

        if (body.includes('Anmeldung fehlgeschlagen')) {
            const errorMsg = 'Anmeldung fehlgeschlagen'
            res.writeHead(500, errorMsg, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'POST'
            });

            res.end();
            return;
        }

        if (pruefungsverwaltungUrl === undefined) {
            let errorMsg = 'Der HdM-Server ist zurzeit nicht wie gewohnt erreichbar.'
            const hours = (new Date).getHours()
            if (hours >= 2 && hours < 4) {
                errorMsg = 'Der HdM-Server steht täglich in der Zeit von 02:00 - 04:00 Uhr nicht zur Verfügung.'
            }

            res.writeHead(500, errorMsg, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'POST'
            });

            res.end();
            return;
        }

        options.url = pruefungsverwaltungUrl
        options.qs = null;
        request(options, function (error, response, body) {
            const $ = cheerio.load(body)
            const notenspiegelUrl = $('.mikronavi_list > ul > li:nth-child(2) a').attr('href');

            options.url = notenspiegelUrl
            request(options, function (error, response, body) {
                const $ = cheerio.load(body)

                const generalTableRow = $('table:nth-of-type(1) > tbody > tr:first-child')
                const studies = generalTableRow.find('td').eq(0).text().trim().substring('Studiengang :  '.length).toLowerCase()

                const notenTableRows = $('table:nth-of-type(2) > tbody > tr:not(:first-child)')
                let bestanden = []
                let angemeldet = []
                notenTableRows.each(function() {
                    if ($(this).find('td').length === 12) {
                        const leistung = {
                            edvNr: $(this).find('td').eq(0).html().trim(),
                            name: $(this).find('td').eq(2).text().trim(),
                            kz: $(this).find('td').eq(3).text().trim(),
                            semester: $(this).find('td').eq(4).text().trim(),
                            note: parseFloat($(this).find('td').eq(5).text().trim().replace(',', '.')),
                            status: $(this).find('td').eq(6).text().trim(),
                            ects: parseInt($(this).find('td').eq(7).text().trim()),
                            vermerk: $(this).find('td').eq(9).text().trim(),
                            versuch: $(this).find('td').eq(10).text().trim()
                        }

                        // Bestanden
                        if (leistung.ects > 0) {
                            if (isNaN(leistung.note)) leistung.note = null
                            if (leistung.vermerk === '') leistung.vermerk = null
                            bestanden.push(leistung)
                        }

                        // Angemeldet
                        else if (leistung.status === 'angemeldet') {
                            if (!angemeldet.some(l => l.edvNr === leistung.edvNr)) {
                                angemeldet.push(leistung)
                            }
                        }
                    }
                })

                const bestandenEdvNr = bestanden.map(l => l.edvNr)
                angemeldet = angemeldet.filter(l => !bestandenEdvNr.includes(l.edvNr))

                for (let i = 0; i < angemeldet.length; i++) {
                    for (let j = 0; j < hdmModule[studies].length; j++) {
                        if (hdmModule[studies][j].edvNr === angemeldet[i].edvNr) {
                            angemeldet[i].name = hdmModule[studies][j].name
                            angemeldet[i].ects = hdmModule[studies][j].ects
                            break
                        }
                    }
                    for (const keyStudies in hdmModule) {
                        if (keyStudies === studies) continue
                        for (let j = 0; j < hdmModule[keyStudies].length; j++) {
                            if (hdmModule[keyStudies][j].edvNr === angemeldet[i].edvNr) {
                                angemeldet[i].name = hdmModule[keyStudies][j].name
                                angemeldet[i].ects = hdmModule[keyStudies][j].ects
                                break
                            }
                        }
                    }
                }

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods': 'POST'
                });

                res.end(JSON.stringify({
                    studies: studies,
                    alleModule: hdmModule,
                    leistungen: {
                        bestanden: bestanden,
                        angemeldet: angemeldet
                    }
                }));
                console.log('reply')
            })
        })
    })
})

app.listen(port);
log.debug('Server listening')
console.log('Server listening on port ' + port)
