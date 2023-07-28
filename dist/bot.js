import webdriver from 'selenium-webdriver';
const { Builder, By, Key, Actions } = webdriver;
import chrome from "selenium-webdriver/chrome.js";
import "chromedriver";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import clipboardy from "clipboardy";
let props = JSON.parse(fs.readFileSync("./props.json", "utf8"));
export { initDriver, openPage, logIn, addCookies, sendMessage, openChat };
const prisma = new PrismaClient();
const headlessMode = false;
let driver;
async function openChat(botId) {
    driver = await initDriver();
    await openPage(driver);
    await addCookies(driver, botId);
    let url = await driver.getCurrentUrl();
    if (!url.startsWith("https://www.facebook.com/messages")) {
        console.log("Invalid cookies! Getting new cookies...");
        await driver.manage().deleteAllCookies();
        await openPage(driver);
        await logIn(driver);
        let cookies;
        let cUserCookie;
        while (cUserCookie === undefined) {
            cookies = await driver.manage().getCookies();
            let xsCookie = await cookies.find((cookie) => cookie.name === 'xs');
            cUserCookie = await cookies.find((cookie) => cookie.name === 'c_user');
            cookies = {
                xsCookie,
                cUserCookie
            };
        }
        await prisma.bot.update({
            where: {
                id: botId
            },
            data: {
                cookies: cookies
            }
        });
    }
}
const saveJson = () => fs.writeFileSync("./props.json", JSON.stringify(props));
async function initDriver() {
    const options = new chrome.Options();
    if (headlessMode) {
        options.excludeSwitches('enable-logging');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-gpu');
        options.addArguments('--disable-infobars');
        options.addArguments('--no-sandbox');
        options.addArguments('--headless');
    }
    const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    return driver;
}
async function openPage(driver) {
    await driver.get(props.chatURL);
    console.log("Opened the page");
}
async function addCookies(driver, botId) {
    try {
        let bot = await prisma.bot.findUnique({
            where: {
                id: botId
            }
        });
        await driver.manage().addCookie(bot.cookies.xsCookie);
        await driver.manage().addCookie(bot.cookies.cUserCookie);
        driver.navigate().refresh();
    }
    catch (err) {
        console.error(err);
    }
}
async function logIn(driver) {
    try {
        const acceptCookiesBtn = await driver.findElement(By.xpath('/html/body/div[3]/div[2]/div/div/div/div/div[3]/button[2]'));
        await acceptCookiesBtn.click();
        const usernameBox = await driver.findElement(By.xpath('/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[1]/input'));
        await usernameBox.sendKeys(props.email);
        console.log("Email Id entered");
        const passwordBox = await driver.findElement(By.xpath('/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[2]/div/div/input'));
        await passwordBox.sendKeys(props.password);
        console.log("Password entered");
        const loginBtn = await driver.findElement(By.xpath('/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[3]/button'));
        await loginBtn.click();
        console.log("Logged in");
    }
    catch (e) { }
}
async function sendMessage(message) {
    try {
        let messageBox;
        while (!messageBox) {
            try {
                messageBox = await driver.findElement(By.xpath('/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p'));
            }
            catch (e) { }
        }
        for (let i = 0; i < props.messagesCount; i++) {
            if (i != 0) {
                messageBox = await driver.findElement(By.xpath('/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p'));
            }
            await clipboardy.write(message);
            await driver.actions()
                .click(messageBox)
                .keyDown(Key.CONTROL)
                .sendKeys('v')
                .keyUp(Key.CONTROL)
                .sendKeys(Key.RETURN)
                .perform();
            console.log("sent" + " (" + (i + 1) + ")");
        }
    }
    catch (e) { }
}
//# sourceMappingURL=bot.js.map