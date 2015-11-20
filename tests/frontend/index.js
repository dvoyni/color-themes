module.exports = {
    "open index page": function(browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible("#index-view", 10000)
            .assert.urlContains("view=index")
            .assert.containsText("#header .logo:nth-child(2)", "Color Themes")
            .waitForElementVisible(".pending-icon", 10000)
            .waitForElementVisible(".preview-list", 10000)
            .assert.containsText(".pager .current", "1")
            .end();
    },
    
    "open next page": function(browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible(".pager a:nth-child(2)", 10000)
            .click(".pager a:nth-child(2)")
            .waitForElementVisible(".preview-list", 10000)
            .assert.urlContains("page=2")
            .assert.containsText(".pager .current", "2")
            .end();
    },

    "width of previews": function(browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible(".preview-list-item", 10000)
            .assert.cssProperty(".preview-list-item", "width", "360px")
            .end();
    }
};
