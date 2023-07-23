import express from 'express';
import cors from 'cors';
import { initDriver, openPage, logIn, addCookies, sendMessage, openChat } from './bot.js';
import fs from 'fs';
import joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { startSheduler } from './scheduler.js';
import v1UserRouter from './v1/routes/userRoutes.js';

// npm start
// npm run build

// use node-cron
const app = express();
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
const port: Number = 3000

// Start checking for new tasks in the DB
startSheduler()

// Register routes
app.use('/api/v1/users', v1UserRouter);

// app.post('/api/try', async (req, res) => {
//     try {
//         // let { } = req.body
       

//     } catch (err: any) {
//         res.status(400).send(err.message)
//     }

//     res.status(200).send('Process succesfull')
// })

// app.post('/api/openChat', async (req, res) => {
//     try {
//         const { botId, message } = req.body
//         // const driver = bot.initDriver()

//         await openChat(botId)
//         //    bot.sendMessage(message)
//     } catch (err: any) {
//         res.status(400).send(err.message)
//     }

//     res.status(200).send('Chat opened succesfully')
// })

// app.post('/api/sendMessage', async (req, res) => {
//     try {
//         const { message } = req.body

//         await sendMessage(message)
//     } catch (err: any) {
//         res.status(400).send(err.message)
//     }

//     res.status(200).send('Message sent succesfully')
// })

// app.post('/api/addMessage', async (req, res) => {
//     try {
//         let { title, content, timestamp, repeating, botName } = req.body
//         // const bot = await prisma.botaccount.findFirst({
//         //     where: {
//         //         name: botName
//         //     }
//         // });
//         timestamp = new Date(timestamp)//.toLocaleString("en-US", { timeZone: "Europe/Sofia" })

//         await prisma.message.create({
//             data: {
//                 title: title,
//                 content: content,
//                 // timestamp: timestamp, //new Date(timestamp).toLocaleString("en-US", { timeZone: "Europe/Sofia" }),
//                 //set timestamp to 22.02.2023 17:45:00
//                 timestamp: timestamp,//new Date(timestamp).toLocaleString("en-US", { timeZone: "Europe/Sofia" }),
//                 repeating: repeating,
//             }
//         })
//     } catch (err: any) {
//         res.status(400).send(err.message)
//     }

//     res.status(200).send('Message added succesfully')
// })


// app.post('/api/addBot', async (req, res) => {
//     try {
//         await prisma.botaccount.create({
//             data: req.body
//         })
//     } catch (err: any) {
//         res.status(400).send(err.message)
//     }

//     res.status(200).send('Bot added succesfully')
// })

// app.get('/api', (request, res) => {
//     res.send('Hello bot API')
// })

// // app.post('/api/register', async (req, res) => {
// //     try {
// //         // const {email,password,firstName,lastName} = req.body;
// //         await prisma.user.create({
// //             data: req.body
// //         })

// //     } catch (err) {
// //         res.status(400).send(err.message)
// //     }

// //     res.status(200).send('data saved succesfully')
// // })


app.listen(port, () => { console.log(`Server is listenning on http://localhost:${port}/`) }) //npm run devStart
