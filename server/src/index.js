const http = require('http');
const request = require('request')
const cheerio = require('cheerio')
const url = require('url')
const hdmModule = require('../storage/hdm-module')

const port = 8080


const app = http.createServer((req, res) => {
	const query = url.parse(req.url, true).query;

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
     asdf: query.username,
     fdsa: query.password },
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
		    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
		});

		res.end();
		return;
	  }

	  if (pruefungsverwaltungUrl == undefined) {
	  	let errorMsg = 'Der HdM-Server ist zurzeit nicht wie gewohnt erreichbar.'
	  	const hours = (new Date).getHours()
	  	if (hours >= 2 && hours < 4) {
	  		errorMsg = 'Der HdM-Server steht täglich in der Zeit von 02:00 - 04:00 Uhr nicht zur Verfügung.'
	  	}

	  	res.writeHead(500, errorMsg, {
		    'Content-Type': 'application/json',
		    'Access-Control-Allow-Origin' : '*',
		    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
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
				for (let j = 0; j < hdmModule.length; j++) {
					if (hdmModule[j].edvNr === angemeldet[i].edvNr) {
                        angemeldet[i].ects = hdmModule[j].ects
						console.log("seettin " + hdmModule[j].ects)
						break
					}
				}
			}

	  		res.writeHead(200, {
			    'Content-Type': 'application/json',
			    'Access-Control-Allow-Origin' : '*',
			    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
			});

    		res.end(JSON.stringify({ bestanden: bestanden, angemeldet: angemeldet }));
    		console.log('reply')
	  	})
	  })
	});

});

app.listen(port);
console.log('Server listening on port ' + port)





