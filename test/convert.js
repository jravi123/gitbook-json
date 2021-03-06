var should = require('should');
var gitbookJson = require('../')

var VERSION2           = require('./fixtures/version2');
var VERSION3           = require('./fixtures/version3');
var VERSION3_CONVERTED = require('./fixtures/version3_converted');

var VERSION2_DEPTH = require('./fixtures/depth_conversion/version2');
var VERSION3_DEPTH = require('./fixtures/depth_conversion/version3');

var ES_VERSION2_INVALID = require('./fixtures/empty_sections/version2_invalid');
var ES_VERSION2_VALID   = require('./fixtures/empty_sections/version2_valid');
var ES_VERSION3         = require('./fixtures/empty_sections/version3');

describe('Detection', function() {
    it('should detect version 1/2', function() {
        gitbookJson.detectVersion(VERSION2).should.equal(2);
    });

    it('should detect version 3', function() {
        gitbookJson.detectVersion(VERSION3).should.equal(3);
    });
});

describe('Convert', function() {
    describe('To Version 3', function() {
        var version3 = gitbookJson.toVersion3(VERSION2);

        it('should not convert json already in version 3', function() {
            gitbookJson.toVersion3(VERSION3).should.equal(VERSION3);
        });

        it('should convert version 1/2 to version 3', function() {
            gitbookJson.toVersion3(VERSION2).should.eql(VERSION3_CONVERTED);
            gitbookJson.toVersion3(VERSION2_DEPTH).should.eql(VERSION3_DEPTH);
        });

        it('should export page.content', function() {
            version3.page.should.be.an.Object();
            version3.page.content.should.be.a.String();
            version3.page.content.should.startWith('<h1');
        });
    });

    describe('To Version 2', function() {
        var version2 = gitbookJson.toVersion2(VERSION3);

        it('should not convert json already in version 1/2', function() {
            gitbookJson.toVersion2(VERSION2).should.equal(VERSION2);
        });

        it('should export sections', function() {
            version2.sections.should.be.an.Array();
            version2.sections.should.have.lengthOf(1);
            version2.sections[0].should.be.an.Object();
            version2.sections[0].content.should.be.a.String();
            version2.sections[0].content.should.startWith('<h1');
        });

        it('should export progress.chapters', function() {
            version2.progress.should.be.an.Object();
            version2.progress.should.have.property('chapters').which.is.an.Array();
            version2.progress.chapters.should.have.lengthOf(21);
            version2.progress.chapters[0].title.should.equal('Introduction');
            version2.progress.chapters[20].title.should.equal('Lua interpreter');
        });

        it('should export progress.current', function() {
            version2.progress.should.be.an.Object();
            version2.progress.should.have.property('current').which.is.an.Object();
            version2.progress.current.title.should.equal('Introduction');
        });

        it('should export progress.percent and progress.prevPercent', function() {
            version2.progress.should.have.property('percent').which.is.an.Number();
            version2.progress.should.have.property('prevPercent').which.is.an.Number();
            version2.progress.percent.should.equal(0);
            version2.progress.prevPercent.should.equal(0);
        });
    });
});

describe('No empty sections', function() {
    var version2_invalid = gitbookJson.toVersion2(ES_VERSION2_INVALID);
    var version2_valid   = gitbookJson.toVersion2(ES_VERSION2_VALID);

    it('should handle empty sections for version 1/2', function() {
        gitbookJson.toVersion2(ES_VERSION2_INVALID).should.eql(ES_VERSION2_VALID);
    });

    it('should handle empty sections for version 3', function() {
        gitbookJson.toVersion3(ES_VERSION2_INVALID).should.eql(ES_VERSION3);
    });

    it('should not alter valid version 1/2 documents', function() {
        gitbookJson.toVersion2(ES_VERSION2_VALID).should.equal(ES_VERSION2_VALID);
        gitbookJson.toVersion2(VERSION2).should.equal(VERSION2);
    });
});
