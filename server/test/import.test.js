const chai = require('chai');
const fs = require('fs')
const cheerio = require('cheerio')

chai.use(require('chai-match'));
const path = 'storage/hdm_export/'

describe('HdM Module Importer', function() {

    it('exported files follow naming conventions', function() {
        fs.readdirSync(path).forEach(file => {
            chai.expect(file).to.match(/^[a-z]{2,3}(3|7)\_(grund|pflicht|wahl)\.html$/)
        });
    });

    it('exported files have valid html and at least one course can be found', function() {
        fs.readdir(path, function(err, files) {
            for (let i = 0; i < files.length; i++) {
                const body = fs.readFileSync(path + files[i], 'utf8');
                const $ = cheerio.load(body)
                const tableRows = $('table tr:not(:first-child, :nth-child(2), :nth-child(3))')

                chai.expect(tableRows).to.have.lengthOf.above(0)
            }
        })
    });

});