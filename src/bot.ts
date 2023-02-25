//npm install --save-dev chromedriver

// const { Builder, By, Key, until } = require("selenium-webdriver");
// const chrome = require("selenium-webdriver/chrome");
// require("chromedriver");
// var schedule = require('node-schedule');
// let props = require("./props.json")
// const fs = require("fs");
// const { PrismaClient } = require('@prisma/client')

// import { Builder, By, Key, actions } from "selenium-webdriver";
import webdriver, { WebDriver } from 'selenium-webdriver';
const { Builder, By, Key, Actions } = webdriver;
import chrome, { Driver } from "selenium-webdriver/chrome.js";
import "chromedriver";
// import schedule from "node-schedule";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import clipboardy from "clipboardy"

// Read the file contents
let props = JSON.parse(fs.readFileSync("./props.json", "utf8"));

export { initDriver, openPage, logIn, addCookies, sendMessage, openChat }

const prisma = new PrismaClient()

//https://crontab.guru/

const headlessMode = false;
let driver: WebDriver

async function openChat(botId: number) {
    driver = await initDriver()
    await openPage(driver)

    await addCookies(driver, botId)
    let url = await driver.getCurrentUrl();

    if (!url.startsWith("https://www.facebook.com/messages")) {
        console.log("Invalid cookies! Getting new cookies...")

        await driver.manage().deleteAllCookies();
        await openPage(driver)
        await logIn(driver)

        let cookies: any
        let cUserCookie: any
        while (cUserCookie === undefined) { // Check sometimes if the undefined problem is solved
            cookies = await driver.manage().getCookies();
            let xsCookie = await cookies.find((cookie: { name: string; }) => cookie.name === 'xs');
            cUserCookie = await cookies.find((cookie: { name: string; }) => cookie.name === 'c_user');
            cookies = {
                xsCookie,
                cUserCookie
            }
        }
        // await console.log(cookies)

        // Save the new cookies
        await prisma.botaccount.update({
            where: {
                id: botId
            },
            data: {
                cookies: cookies
            }
        })

        // return driver
    }

    // await sendMessage(driver,message)

    // Schedule
    // time = Date.now() + 12 * 1000 //now + 10 sec
    // await scheduleMessage(time,driver)
}

// async function scheduleMessage(time, driver:WebDriver) {
//     // const date = new Date('2023-02-10T19:51:00+02:00')
//     // const repeating = '*/30 * * * * *' //every 30 sec

//     schedule.scheduleJob(time, async () => {
//         await sendMessage(driver)
//         console.log("this should be second")
//     })
// }

const saveJson = () => fs.writeFileSync("./props.json", JSON.stringify(props));

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

async function openPage(driver: webdriver.WebDriver) {
    await driver.get(props.chatURL);
    console.log("Opened the page");
}

async function addCookies(driver: WebDriver, botId: number) {
    try {
        let bot = await prisma.botaccount.findUnique({
            where: {
                id: botId
            }
        })
            // @ts-ignore
            await driver.manage().addCookie(bot!.cookies!.xsCookie);
            // @ts-ignore
            await driver.manage().addCookie(bot!.cookies!.cUserCookie);
            driver.navigate().refresh();
    }
    catch (err) {
        console.error(err)
    }
}

async function logIn(driver: WebDriver) {
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

// const sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

// async function tagPerson(messageBox, name) { //not tested! TODO
//     await messageBox.sendKeys("@" + name, Key.TAB);
// }

async function sendMessage(message: string) {
    // try to find the element until the page load 
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

            //save message to clipboard
            await clipboardy.write(message);
            //paste message
            await driver.actions()
                .click(messageBox)
                .keyDown(Key.CONTROL)
                .sendKeys('v')
                .keyUp(Key.CONTROL)
                .sendKeys(Key.RETURN)
                .perform()

            console.log("sent" + " (" + (i + 1) + ")")
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