module.exports = {
    "open index page": function(browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible("#index-view", 3000)
            .assert.containsText("#header .logo:nth-child(2)", "Color Themes")
            .waitForElementVisible(".pending-icon", 100)
            .waitForElementVisible(".preview-list", 5000)
            .assert.containsText(".pager .current", "1")
            .end();
    }
};
