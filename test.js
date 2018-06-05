let FirefoxTest = require('./vendors/FirefoxTest');
let ChromeTest = require('./vendors/ChromeTest');

let OpenPositionToolbarHeadlessTest = require('./tests/OpenPositionToolbarHeadlessTest');

function runMozilla() {
    let firefoxTest = new FirefoxTest();
    firefoxTest.run();
}

function runChrome() {
    let chromeTest = new ChromeTest(runMozilla);
    chromeTest.addTest(new OpenPositionToolbarHeadlessTest());
    chromeTest.run();
}

runChrome();