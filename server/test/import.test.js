const chai = require('chai');
const fs = require('fs')

chai.use(require('chai-match'));
const path = 'storage/hdm_export/'

describe('HdM Module Importer', function() {

    it('exported files follow naming conventions', function() {
        fs.readdirSync(path).forEach(file => {
            chai.expect(file).to.match(/^[a-z]{2,3}(3|7)\_(grund|pflicht|wahl)\.html$/)
        });
    });

});