const { Builder, By, until } = require('selenium-webdriver');

async function testCMS() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5000');

        // Wait for Title input
        await driver.wait(until.elementLocated(By.name('title')), 5000);

        // TC1: Enter Title
        let titleInput = await driver.findElement(By.name('title'));
        await titleInput.sendKeys("Test Title");

        // TC2: Enter Description
        let descInput = await driver.findElement(By.name('description'));
        await descInput.sendKeys("Test Description");

        // TC3: Click Add Content button
        let button = await driver.findElement(By.xpath("//button[text()='Add Content']"));
        await button.click();

        // Wait for content to appear
        await driver.sleep(2000);

        console.log("Content added successfully");

        // TC4: Add multiple entries
        for (let i = 1; i <= 2; i++) {

    await driver.wait(until.elementLocated(By.name('title')), 5000);

    let titleInput = await driver.findElement(By.name('title'));
    await titleInput.clear();
    await titleInput.sendKeys("Title " + i);

    let descInput = await driver.findElement(By.name('description'));
    await descInput.clear();
    await descInput.sendKeys("Desc " + i);

    let button = await driver.findElement(By.xpath("//button[text()='Add Content']"));
    await button.click();

    await driver.sleep(1000);
}

        console.log("Multiple entries added");

        // TC5: Refresh
        await driver.navigate().refresh();
        console.log("Page refreshed");

    } catch (err) {
        console.error("Test Failed:", err);
    } finally {
        await driver.quit();
    }
}

testCMS();