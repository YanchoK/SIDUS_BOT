import cron from "node-cron";
import { PrismaClient } from '@prisma/client';
import { openChat, sendMessage } from './bot.js';
const prisma = new PrismaClient();
export function startSheduler() {
    cron.schedule('* * * * *', async () => {
        let now = new Date();
        let messages = await prisma.task.findMany({
            where: {
                remindTime: {
                    lte: now,
                },
                sent: false
            }
        });
        await messages.forEach(async (task) => {
            try {
                await openChat(task.bot_id || 0);
                await sendMessage(task.content);
                if (task.recurring != "Does not repeat") {
                    let rep = task.recurring.split(" ");
                    let num = parseInt(rep[1]);
                    let interval = rep[2];
                    let date = new Date(task.remindTime);
                    switch (interval) {
                        case "day":
                            date.setDate(date.getDate() + num);
                            break;
                        case "week":
                            date.setDate(date.getDate() + 7 * num);
                            break;
                        case "month":
                            date.setMonth(date.getMonth() + num);
                            break;
                        case "year":
                            date.setFullYear(date.getFullYear() + num);
                            break;
                    }
                    await prisma.task.create({
                        data: {
                            ...task,
                            id: undefined,
                            remindTime: date
                        }
                    });
                }
                await prisma.task.update({
                    where: { id: task.id },
                    data: { sent: true },
                });
                console.log(` - Updated task with id ${task.id}`);
            }
            catch (err) {
                console.log(err);
            }
        });
        console.log("Checked for sheduled messages.");
    });
}
//# sourceMappingURL=scheduler.js.map