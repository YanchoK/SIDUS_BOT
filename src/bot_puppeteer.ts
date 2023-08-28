import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PrismaClient, Task, Chat, Bot } from '@prisma/client'

type FullTask = Task & { bot: Bot } & { chat: Chat }

export default class AutoBot {
    // private messageBoxXPath = '/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p';
    private executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'; // Replace this with the path to your Chrome executable
    private messageBoxXPath = '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p';
    private messageBoxXPath2 = '/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div[2]/div/div/div[1]/p';
    private acceptCookiesBtnXPath = '/html/body/div[3]/div[2]/div/div/div/div/div[4]/button[2]'
    private usernameBoxXPath = '/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[1]/input'
    private passwordBoxXPath = '/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[2]/div/div/input'
    private loginBtnXPath = '/html/body/div[1]/div[1]/div[1]/div/div[3]/div[2]/form/div[2]/div[3]/button'

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient()
        puppeteer.default.use(StealthPlugin())
    }

    public async main(taskId: number) {
        const task: FullTask = await this.prisma.task.findUniqueOrThrow({
            where: { id: taskId },
            include: { chat: true, bot: true }
        })
        
        //open the page
        const { browser, page } = await this.openWebPage(task)

        const element = await page.$('.xat24cr');
        if (element) {
            console.log('loaded')
            await this.sendMessage(page, task)
        } else {
            console.log('about to log in!!!')
            await this.logIn(page, task)
            //check if the page loaded
            await page.waitForSelector('.xat24cr');
            //save the new cookies
            await this.getCookies(page, task);
            await this.sendMessage(page, task);
        }
        // await browser.close();
    }

    public async openWebPage(task: FullTask) {
        const config = {
            executablePath: this.executablePath,
            headless: false,
            //, '--disable-notifications'], //this maby disables premissions pop ups, but shows that it's a bot
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications'],
            // ignoreDefaultArgs: ["--enable-automation"], //clears the message that it's controlled by a bot
        };

        const browser = await puppeteer.default.launch(config)
        const page = await browser.newPage();
        await this.setCookies(page, task)
        await page.goto(task.chat.url);
        return { browser, page };
    }

    public async getCookies(page: any, task: FullTask) {
        console.log(`Cookises to save to db:`)
        const cookies = await page.cookies();
        console.log(cookies)
        // const cookieJson = JSON.stringify(cookies);
        // const change = { cookies: cookieJson }

        const updatedTask = await this.prisma.bot.update({
            where: {
                id: task.bot_id,
            },
            data: { cookies: cookies },
        })
        console.log(updatedTask)

        // And save this data to a JSON file
        // fs.writeFileSync('cookies.json', cookieJson);
    };

    public async setCookies(page: any, task: FullTask) {
        try {
            console.log("Entered setCookies()")
            const cookies = JSON.stringify(task.bot.cookies);
            const deserializedCookies = await JSON.parse(cookies);
            await page.setCookie(...deserializedCookies);
        }
        catch (error: any) {
            console.log(error?.message)
        }
    }

    public async logIn(page: any, task: FullTask) {
        console.log('before allow!')
        const acceptCookiesBtn = await page.waitForXPath(this.acceptCookiesBtnXPath);
        console.log(acceptCookiesBtn)
        await acceptCookiesBtn.click();
        console.log('clicked allow!')
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

    public async sendMessage(page: any, task: FullTask) {
        const searchBox = await page.waitForSelector('p');
        console.log('Sending message.')
        await searchBox.click();
        await searchBox.type(task.content);
        await page.keyboard.press('Enter');
        console.log('Message sended.')
    }
}



