const { Builder, By, until } = require('selenium-webdriver');

async function testAddition() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // ✅ Correct local file path (use forward slashes)
        const filePath = 'file:///C:/Users/hp/Downloads/content-management-app/Pr%205,6,7/selenium-test/js-selenium-test/index.html';

        await driver.get(filePath);
        console.log("Page opened");

        // ✅ Wait for elements to load
        await driver.wait(until.elementLocated(By.id('num1')), 5000);

        let num1 = await driver.findElement(By.id('num1'));
        let num2 = await driver.findElement(By.id('num2'));

        // Enter values
        await num1.sendKeys('5');
        await num2.sendKeys('3');

        // Click button
        await driver.findElement(By.tagName('button')).click();

        await driver.sleep(1000);

        // Get result
        let resultText = await driver.findElement(By.id('result')).getText();
        console.log("Result:", resultText);

        // Validate result
        if (resultText.includes('8')) {
            console.log("Test Passed");
        } else {
            console.log("Test Failed");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await driver.quit();
    }
}

testAddition();