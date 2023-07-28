import express from 'express';
import cors from 'cors';
import { initDriver, openPage, logIn, addCookies, sendMessage, openChat } from './bot.js';
import fs from 'fs';
import joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { startSheduler } from './scheduler.js';
import v1UserRouter from './v1/routes/userRoutes.js';
import v1TaskRouter from './v1/routes/taskRoutes.js';
import bodyParser from 'body-parser';
// import { swaggerDocs as V1SwaggerDocs } from "../dist/v1/swagger.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from './swagger.json';

// npm start
// npm run build
// npx prisma migrate dev (always stop the server in order to apply in the code)
// npx prisma db push

//TODO: fix create task to get all properties => change task model



// use node-cron
const app = express();
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
const port: Number = 3000

// Start checking for new tasks in the DB
// startSheduler()

app.use(bodyParser.json())
// Register routes
app.use('/api/v1/users', v1UserRouter);
app.use('/api/v1/tasks', v1TaskRouter);

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }', // This line removes the "Authorize" button
  };
app.use('/',swaggerUi.serve,swaggerUi.setup(swaggerDocument,swaggerOptions))

app.listen(port, () => { 
    console.log(`Server is listenning on http://localhost:${port}/`)
})

// const swaggerSpecs = swaggerJsdoc({
//     swaggerDefinition: swaggerDocument,
//     apis: ['your-api-file.js'], // Replace with the file containing your JSDoc comments
//   });
  
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  
//   const port = 3000;
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });


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