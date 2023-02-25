// const express = require('express')
// const app = express()
// const cors = require("cors")
// const bot = require('./bot.js')
// const fs = require("fs");
// const joi = require("joi")

// const { PrismaClient } = require('@prisma/client')
import express from 'express';
import cors from 'cors';
import { initDriver, openPage, logIn, addCookies, sendMessage, openChat } from './bot.js';
import fs from 'fs';
import joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { main } from './scheduler.js';
// use node-cron

const app = express();
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
const port: Number = 3000

app.post('/api/try', async (req, res) => {
    try {
        // let { } = req.body
        main()

    } catch (err: any) {
        res.status(400).send(err.message)
    }

    res.status(200).send('Process succesfull')
})

app.post('/api/openChat', async (req, res) => {
    try {
        const { botId, message } = req.body
        // const driver = bot.initDriver()

        await openChat(botId)
        //    bot.sendMessage(message)
    } catch (err: any) {
        res.status(400).send(err.message)
    }

    res.status(200).send('Chat opened succesfully')
})

app.post('/api/sendMessage', async (req, res) => {
    try {
        const { message } = req.body

        await sendMessage(message)
    } catch (err: any) {
        res.status(400).send(err.message)
    }

    res.status(200).send('Message sent succesfully')
})

app.post('/api/addMessage', async (req, res) => {
    try {
        let { title, content, timestamp, repeating, botName } = req.body
        // const bot = await prisma.botaccount.findFirst({
        //     where: {
        //         name: botName
        //     }
        // });
        timestamp = new Date(timestamp)//.toLocaleString("en-US", { timeZone: "Europe/Sofia" })

        await prisma.message.create({
            data: {
                title: title,
                content: content,
                // timestamp: timestamp, //new Date(timestamp).toLocaleString("en-US", { timeZone: "Europe/Sofia" }),
                //set timestamp to 22.02.2023 17:45:00
                timestamp: timestamp,//new Date(timestamp).toLocaleString("en-US", { timeZone: "Europe/Sofia" }),
                repeating: repeating,
            }
        })
    } catch (err: any) {
        res.status(400).send(err.message)
    }

    res.status(200).send('Message added succesfully')
})


app.post('/api/addBot', async (req, res) => {
    try {
        await prisma.botaccount.create({
            data: req.body
        })
    } catch (err: any) {
        res.status(400).send(err.message)
    }

    res.status(200).send('Bot added succesfully')
})

// routes
app.get('/api', (request, res) => {
    res.send('Hello bot API')
})

// app.post('/api/register', async (req, res) => {
//     try {
//         // const {email,password,firstName,lastName} = req.body;
//         await prisma.user.create({
//             data: req.body
//         })

//     } catch (err) {
//         res.status(400).send(err.message)
//     }

//     res.status(200).send('data saved succesfully')
// })


app.listen(port, () => { console.log(`Server is listenning on http://localhost:${port}/`) }) //npm run devStart
