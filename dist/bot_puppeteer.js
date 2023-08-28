import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PrismaClient } from '@prisma/client';
export default class AutoBot {
    executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    messageBoxXPath = '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p';
    messageBoxXPath2 = '/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p';
    acceptCookiesBtnXPath = '/html/body/div[3]/div[2]/div/div/div/div/div[4]/button[2]';
    usernameBoxXPath = '/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[1]/input';
    passwordBoxXPath = '/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[2]/div/div/input';
    loginBtnXPath = '/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[3]/button';
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
        puppeteer.default.use(StealthPlugin());
    }
    async main(taskId) {
        const task = await this.prisma.task.findUniqueOrThrow({
            where: { id: taskId },
            include: { chat: true, bot: true }
        });
        const { browser, page } = await this.openWebPage(task);
        const element = await page.$('.xat24cr');
        if (element) {
            console.log('loaded');
            await this.sendMessage(page, task);
        }
        else {
            console.log('about to log in!!!');
            await this.logIn(page, task);
            await page.waitForSelector('.xat24cr');
            await this.getCookies(page, task);
            await this.sendMessage(page, task);
        }
    }
    async openWebPage(task) {
        const config = {
            executablePath: this.executablePath,
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications'],
        };
        const browser = await puppeteer.default.launch(config);
        const page = await browser.newPage();
        await this.setCookies(page, task);
        await page.goto(task.chat.url);
        return { browser, page };
    }
    async getCookies(page, task) {
        console.log(`Cookises to save to db:`);
        const cookies = await page.cookies();
        console.log(cookies);
        const updatedTask = await this.prisma.bot.update({
            where: {
                id: task.bot_id,
            },
            data: { cookies: cookies },
        });
        console.log(updatedTask);
    }
    ;
    async setCookies(page, task) {
        try {
            console.log("Entered setCookies()");
            const cookies = JSON.stringify(task.bot.cookies);
            const deserializedCookies = await JSON.parse(cookies);
            await page.setCookie(...deserializedCookies);
        }
        catch (error) {
            console.log(error?.message);
        }
    }
    async logIn(page, task) {
        console.log('before allow!');
        const acceptCookiesBtn = await page.waitForXPath(this.acceptCookiesBtnXPath);
        console.log(acceptCookiesBtn);
        await acceptCookiesBtn.click();
        console.log('clicked allow!');
        const usernameBox = await page.waitForXPath(this.usernameBoxXPath);
        await usernameBox.type(task.bot.email);
        console.log("Email Id entered");
        const passwordBox = await page.waitForXPath(this.passwordBoxXPath);
        await passwordBox.type(task.bot.password);
        console.log("Password entered");
        const loginBtn = await page.waitForXPath(this.loginBtnXPath);
        await loginBtn.click();
        console.log("Logged in");
    }
    async sendMessage(page, task) {
        const searchBox = await page.waitForSelector('p');
        console.log('Sending message.');
        await searchBox.click();
        await searchBox.type(task.content);
        await page.keyboard.press('Enter');
        console.log('Message sended.');
    }
}
//# sourceMappingURL=bot_puppeteer.js.map