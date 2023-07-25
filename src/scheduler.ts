import cron from "node-cron"
import { PrismaClient, message } from '@prisma/client';
import { openChat, sendMessage } from './bot.js';

const prisma = new PrismaClient()

export function startSheduler() {
    cron.schedule('* * * * *', async () => {
        let now = new Date()

        let messages: message[] = await prisma.message.findMany({
            where: {
                timestamp: {
                    lte: now,
                },
                sent: false
            }
        })

        await messages.forEach(async message => {
            // login in messenger and send message
            try {
                await openChat(message.bot_account_id)
                await sendMessage(message.content)


                if (message.repeating != "Does not repeat") {
                    let rep = message.repeating.split(" ")
                    let num: number = parseInt(rep[1])
                    let interval = rep[2]

                    let date = new Date(message.timestamp)

                    switch (interval) {
                        case "day":
                            date.setDate(date.getDate() + num)
                            break;
                        case "week":
                            date.setDate(date.getDate() + 7 * num)
                            break;
                        case "month":
                            date.setMonth(date.getMonth() + num)
                            break;
                        case "year":
                            date.setFullYear(date.getFullYear() + num)
                            break;
                    }

                    await prisma.message.create({
                        data: {
                            ...message,
                            id: undefined,
                            timestamp: date
                        }
                    })
                }

                await prisma.message.update({
                    where: { id: message.id },
                    data: { sent: true },
                })

                console.log(` - Updated message with id ${message.id}`);

            } catch (err: any) {
                console.log(err)
            }
        })

        //whis will show up first because previous func is now awaited
        console.log("Checked for sheduled messages.")
    })
}