//npm install --save-dev chromedriver

const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
var schedule = require('node-schedule');
let props = require("./props.json")
const fs = require("fs");
// Read the file contents
let propsData = JSON.parse(fs.readFileSync("./props.json", "utf8"));



//https://crontab.guru/

const headlessMode = false;

exports.send = async function () {
    const driver = await initDriver()
    await openPage(driver)

    // // await logIn(driver)

    addCookies(driver) // TODO: check if the cookie is valid. if not log in and save the cookie

    await sendMessage(driver)

    // Schedule
    // time = Date.now() + 12 * 1000 //now + 10 sec
    // await scheduleMessage(time,driver)
}

async function scheduleMessage(time, driver) {
    // const date = new Date('2023-02-10T19:51:00+02:00')
    // const repeating = '*/30 * * * * *' //every 30 sec

    schedule.scheduleJob(time, async () => {
        await sendMessage(driver)
        console.log("this should be second")
    })
}

const saveJson = () => fs.writeFileSync("./props.json", JSON.stringify(propsData));

async function initDriver() {
    const options = new chrome.Options();

    if (headlessMode) {
        options.excludeSwitches('enable-logging')
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

async function addCookies(driver) {
    await driver.manage().addCookie(props.cookie.xs);
    await driver.manage().addCookie(props.cookie.c_user);
    driver.navigate().refresh();

    // let xs = {
    //     name: 'xs',
    //     value: '23%3AJEsjdTIdAd4yLA%3A2%3A1676314518%3A-1%3A5471'
    // };

    // let c_user = {
    //     name: 'c_user',
    //     value: '100006795273159'
    // };
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function tagPerson(messageBox, name) { //not tested! TODO
    await messageBox.sendKeys("@" + name, Key.TAB);
}

async function sendMessage(driver) {
    //try to find the element until the page load 
    try {
        let messageBox;
        while (!messageBox) {
            try {
                messageBox = await driver.findElement(By.xpath('/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p'));
            } catch (e) { }
        }

        for (let i = 0; i < props.messagesCount; i++) {
            if (i != 0) {
                messageBox = await driver.findElement(By.xpath('/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p'));
            }

            await messageBox.sendKeys(props.message, Key.RETURN);
            console.log("sent" + " (" + i + 1 + ")")
        }
    }
    catch (e) { }
}





// await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div/div/div/div[3]/div/div/div[1]/div/div/div[46]/div/div/div[1]/div[2]/div[1]/div[2]/div/div/div/span/div/div/div/span/img')),60000)
            // .then(() => {
            //     console.log('Element with ID "my-element" exists');
            //   })
            //   .catch((err) => {
            //     console.error('Error:', err);
            //   });

            // await driver.manage().getCookies().then(function(cookies) {
            //     console.log('cookie details => ', cookies);
            //     // props.cookies=cookies;
            //     console.log('props cookies => ', props.cookies);
            // });