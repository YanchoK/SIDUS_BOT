import express from 'express';
import cors from 'cors';
import { sendMessage, openChat } from './bot.js';
import { PrismaClient } from '@prisma/client';
import { main } from './scheduler.js';
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
const port = 3000;
app.post('/api/try', async (req, res) => {
    try {
        main();
    }
    catch (err) {
        res.status(400).send(err.message);
    }
    res.status(200).send('Process succesfull');
});
app.post('/api/openChat', async (req, res) => {
    try {
        const { botId, message } = req.body;
        await openChat(botId);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
    res.status(200).send('Chat opened succesfully');
});
app.post('/api/sendMessage', async (req, res) => {
    try {
        const { message } = req.body;
        await sendMessage(message);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
    res.status(200).send('Message sent succesfully');
});
app.post('/api/addMessage', async (req, res) => {
    try {
        let { title, content, timestamp, repeating, botName } = req.body;
        timestamp = new Date(timestamp);
        await prisma.message.create({
            data: {
                title: title,
                content: content,
                timestamp: timestamp,
                repeating: repeating,
            }
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
    res.status(200).send('Message added succesfully');
});
app.post('/api/addBot', async (req, res) => {
    try {
        await prisma.botaccount.create({
            data: req.body
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
    res.status(200).send('Bot added succesfully');
});
app.get('/api', (request, res) => {
    res.send('Hello bot API');
});
app.listen(port, () => { console.log(`Server is listenning on http://localhost:${port}/`); });
//# sourceMappingURL=server.js.map