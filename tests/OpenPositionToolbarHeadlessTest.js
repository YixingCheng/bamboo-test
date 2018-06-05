const {expect} = require('chai');
var assert = require('chai').assert;
const puppeteer = require('puppeteer');
const {isDebugging, getHost} = require('../util/TestUtil');

const host = getHost();

module.exports = class TradeHistoryHeadlessTest {
    run(factory, next) {
        var me = this;

        describe('Test Open Position Toolbar As Market Admin', function () {
            let browser;
            let page;
            this.timeout(5 * 1000 * 60);

            before(async function () {
                browser = await puppeteer.launch(isDebugging());
                page = await browser.newPage();
                await page.goto(`http://${host}.nex.lan/index`);
                await page.type('#login-panel-username-inputEl', 'nex');
                await page.type('#login-panel-password-inputEl', 'nexmos');
                await page.click('#login-panel-submit-btnInnerEl');
                await page.waitForNavigation();
            });

            it('Market Admin Should See Open Position Link', async function() {
                await page.waitForSelector('img[class*=\'nodal-logo\']');
                const openPositionLink = await page.$x(`//span[text()='Open Position 2.0']`);
                assert.equal(1, openPositionLink.length)
            });

            it('Market Admin Should See All Dropdowns in Participant Fieldset', async () => {
                await page.goto(`http://${host}.nex.lan/openposition`);
                await page.waitForXPath(`//span[text()='Positions']`);
                const isClearingMemberVisible = await me.isVisibleByXPath(`//label[text()='Clearing Member:']/ancestor::table`, page);
                assert.equal(true, isClearingMemberVisible);
                const isAccountGroupVisible = await me.isVisibleByXPath(`//label[text()='Account Group:']/ancestor::table`, page);
                assert.equal(true, isAccountGroupVisible);
                const isTradingAccountVisible = await me.isVisibleByXPath(`//label[text()='Trading Account:']/ancestor::table`, page);
                assert.equal(true, isTradingAccountVisible)
            });

            it('Market Admin Should See Other Inputs Like Snapshot Type, Date, Instrument', async () => {
                const isSnapshotTypeVisible = await me.isVisibleByXPath(`//label[text()='Snapshot Type:']/ancestor::table`, page);
                assert.equal(true, isSnapshotTypeVisible);
                const isProductTypeVisible = await me.isVisibleByXPath(`//label[text()='Product Type:']/ancestor::table`, page);
                assert.equal(true, isProductTypeVisible);
                const isCommodityCodeVisible = await me.isVisibleByXPath(`//label[text()='Commodity Code:']/ancestor::table`, page);
                assert.equal(true, isCommodityCodeVisible)
                const isInstrumentVisible = await me.isVisibleByXPath(`//label[text()='Instrument:']/ancestor::table`, page);
                assert.equal(true, isInstrumentVisible)
                const dateInput = await page.$x(`//label[text()='Date:']/ancestor::table//input`);
                const dateInputdisabledValue = await dateInput[0].getProperty('disabled');
                assert.equal(await dateInputdisabledValue.jsonValue(), true)
            });

            it('Date Input Is Enabled When Select Middle Day in Snapshot Type', async () => {
                const snapshotDropdown = await page.$x(`//label[text()='Snapshot Type:']/ancestor::table//input`);
                await snapshotDropdown[0].click();
                const middayOption = await page.$x(`//li[text()='Midday']`);
                await middayOption[0].click();
                const dateInput = await page.$x(`//label[text()='Date:']/ancestor::table//input`);
                const dateInputdisabledValue = await dateInput[0].getProperty('disabled');
                assert.equal(await dateInputdisabledValue.jsonValue(), false)
            });

            after(async function () {
                await page.close();
                await browser.close()
            });
        });

        describe('Test Open Position Toolbar As Broker', function () {
            let browser;
            let page;
            this.timeout(5 * 1000 * 60);

            before(async function () {
                browser = await puppeteer.launch(isDebugging())
                page = await browser.newPage();
                await page.goto(`http://${host}.nex.lan/index`);
                await page.type('#login-panel-username-inputEl', 'br9_bro_broker');
                await page.type('#login-panel-password-inputEl', 'nexmos');
                await page.click('#login-panel-submit-btnInnerEl');
                await page.waitForNavigation();
            });

            it('Broker Should Not See Open Position Link', async function() {
                await page.waitForSelector('img[class*=\'nodal-logo\']');
                const openPositionLink = await page.$x(`//span[text()='Open Position 2.0']`);
                assert.equal(0, openPositionLink.length)
            });

            after(async function () {
                await page.close();
                await browser.close()
            });
        });

        describe('Test Open Position Toolbar As Clearing Member', function () {
            let browser;
            let page;
            this.timeout(5 * 1000 * 60);

            before(async function () {
                browser = await puppeteer.launch(isDebugging())
                page = await browser.newPage()
                await page.goto(`http://${host}.nex.lan/index`);
                await page.type('#login-panel-username-inputEl', 'teb_cm_gcmadmin');
                await page.type('#login-panel-password-inputEl', 'nexmos');
                await page.click('#login-panel-submit-btnInnerEl');
                await page.waitForNavigation();
            });

            it('Clearing Member Should See Open Position Link', async () => {
                await page.waitForSelector('img[class*=\'nodal-logo\']');
                const openPositionLink = await page.$x(`//span[text()='Open Position 2.0']`);
                assert.equal(1, openPositionLink.length)
            });

            it('Clearing Member Should See Account Group and Trading Account in Participant Fieldset', async () => {
                await page.goto(`http://${host}.nex.lan/openposition`);
                await page.waitForXPath(`//span[text()='Positions']`);
                const isClearingMemberVisible = await me.isVisibleByXPath(`//label[text()='Clearing Member:']/ancestor::table`, page);
                assert.equal(false, isClearingMemberVisible);
                const isAccountGroupVisible = await me.isVisibleByXPath(`//label[text()='Account Group:']/ancestor::table`, page);
                assert.equal(true, isAccountGroupVisible);
                const isTradingAccountVisible = await me.isVisibleByXPath(`//label[text()='Trading Account:']/ancestor::table`, page);
                assert.equal(true, isTradingAccountVisible)
            });

        it('Clearing Member Should See Other Inputs Like Snapshot Type, Date, Instrument', async () => {
            const isSnapshotTypeVisible = await me.isVisibleByXPath(`//label[text()='Snapshot Type:']/ancestor::table`, page);
            assert.equal(true, isSnapshotTypeVisible);
            const isProductTypeVisible = await me.isVisibleByXPath(`//label[text()='Product Type:']/ancestor::table`, page);
            assert.equal(true, isProductTypeVisible);
            const isCommodityCodeVisible = await me.isVisibleByXPath(`//label[text()='Commodity Code:']/ancestor::table`, page);
            assert.equal(true, isCommodityCodeVisible)
            const isInstrumentVisible = await me.isVisibleByXPath(`//label[text()='Instrument:']/ancestor::table`, page);
            assert.equal(true, isInstrumentVisible)
            const dateInput = await page.$x(`//label[text()='Date:']/ancestor::table//input`);
            const dateInputdisabledValue = await dateInput[0].getProperty('disabled');
            assert.equal(await dateInputdisabledValue.jsonValue(), true)
        });

            after(async function () {
                await page.close();
                await browser.close()
            });
        });

        describe('Test Open Position Toolbar As Account Group', function () {
            let browser;
            let page;
            this.timeout(5 * 1000 * 60);

            before(async function () {
                browser = await puppeteer.launch(isDebugging())
                page = await browser.newPage()
                await page.goto(`http://${host}.nex.lan/index`);
                await page.type('#login-panel-username-inputEl', 'teb_ag_ncpadmin');
                await page.type('#login-panel-password-inputEl', 'nexmos');
                await page.click('#login-panel-submit-btnInnerEl');
                await page.waitForNavigation();
            });

            it('Account Group Should See Open Position Link', async () => {
                await page.waitForSelector('img[class*=\'nodal-logo\']');
                const openPositionLink = await page.$x(`//span[text()='Open Position 2.0']`);
                assert.equal(1, openPositionLink.length)
            });

            it('Account Group Should See Trading Account in Participant Fieldset', async () => {
                await page.goto(`http://${host}.nex.lan/openposition`);
                await page.waitForXPath(`//span[text()='Positions']`);
                const isClearingMemberVisible = await me.isVisibleByXPath(`//label[text()='Clearing Member:']/ancestor::table`, page);
                assert.equal(false, isClearingMemberVisible);
                const isAccountGroupVisible = await me.isVisibleByXPath(`//label[text()='Account Group:']/ancestor::table`, page);
                assert.equal(false, isAccountGroupVisible);
                const isTradingAccountVisible = await me.isVisibleByXPath(`//label[text()='Trading Account:']/ancestor::table`, page);
                assert.equal(true, isTradingAccountVisible)
            });

        it('Clearing Member Should See Other Inputs Like Snapshot Type, Date, Instrument', async () => {
            const isSnapshotTypeVisible = await me.isVisibleByXPath(`//label[text()='Snapshot Type:']/ancestor::table`, page);
            assert.equal(true, isSnapshotTypeVisible);
            const isProductTypeVisible = await me.isVisibleByXPath(`//label[text()='Product Type:']/ancestor::table`, page);
            assert.equal(true, isProductTypeVisible);
            const isCommodityCodeVisible = await me.isVisibleByXPath(`//label[text()='Commodity Code:']/ancestor::table`, page);
            assert.equal(true, isCommodityCodeVisible)
            const isInstrumentVisible = await me.isVisibleByXPath(`//label[text()='Instrument:']/ancestor::table`, page);
            assert.equal(true, isInstrumentVisible)
            const dateInput = await page.$x(`//label[text()='Date:']/ancestor::table//input`);
            const dateInputdisabledValue = await dateInput[0].getProperty('disabled');
            assert.equal(await dateInputdisabledValue.jsonValue(), true)
        });

            after(async function () {
                await page.close();
                await browser.close()
            });
        });

        describe('Test Open Position Toolbar As Trading Account', function () {
            let browser;
            let page;
            this.timeout(5 * 1000 * 60);

            before(async function () {
                browser = await puppeteer.launch(isDebugging())
                page = await browser.newPage()
                await page.goto(`http://${host}.nex.lan/index`);
                await page.type('#login-panel-username-inputEl', 'te3_ta_trader');
                await page.type('#login-panel-password-inputEl', 'nexmos');
                await page.click('#login-panel-submit-btnInnerEl');
                await page.waitForNavigation();
            });

            it('Trading Account Should See Open Position Link', async () => {
                await page.waitForSelector('img[class*=\'nodal-logo\']');
                const openPositionLink = await page.$x(`//span[text()='Open Position 2.0']`);
                assert.equal(1, openPositionLink.length)
            });

            it('Trading Account Should Not See Participant Fieldset', async () => {
                await page.goto(`http://${host}.nex.lan/openposition`);
                await page.waitForXPath(`//span[text()='Positions']`);
                const isParticipantFieldSetVisible = await me.isVisibleByXPath(`//label[text()='Clearing Member:']/ancestor::fieldset`, page);
                assert.equal(false, isParticipantFieldSetVisible);
            });

        it('Clearing Member Should See Other Inputs Like Snapshot Type, Date, Instrument', async () => {
            const isSnapshotTypeVisible = await me.isVisibleByXPath(`//label[text()='Snapshot Type:']/ancestor::table`, page);
            assert.equal(true, isSnapshotTypeVisible);
            const isProductTypeVisible = await me.isVisibleByXPath(`//label[text()='Product Type:']/ancestor::table`, page);
            assert.equal(true, isProductTypeVisible);
            const isCommodityCodeVisible = await me.isVisibleByXPath(`//label[text()='Commodity Code:']/ancestor::table`, page);
            assert.equal(true, isCommodityCodeVisible)
            const isInstrumentVisible = await me.isVisibleByXPath(`//label[text()='Instrument:']/ancestor::table`, page);
            assert.equal(true, isInstrumentVisible)
            const dateInput = await page.$x(`//label[text()='Date:']/ancestor::table//input`);
            const dateInputdisabledValue = await dateInput[0].getProperty('disabled');
            assert.equal(await dateInputdisabledValue.jsonValue(), true)
        });

            after(async function () {
                await page.close();
                await browser.close()
            });
        });
    }

    async isVisibleByXPath(xpath, page) {
        return await page.evaluate((xpath) => {
            const e = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!e)
                return false;
            const style = window.getComputedStyle(e);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        }, xpath)
    }
};

