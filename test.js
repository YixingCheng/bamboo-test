let FirefoxTest = require('./vendors/FirefoxTest');
let ChromeTest = require('./vendors/ChromeTest');

function runMozilla() {
    let firefoxTest = new FirefoxTest();
    firefoxTest.run();
}

function runChrome() {
    let chromeTest = new ChromeTest(runMozilla);
    chromeTest.run();
}

runChrome();
