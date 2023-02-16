const express = require('express')
const app = express()
const cors = require("cors")
const bot = require('./bot.js')
const fs = require("fs");
const joi = require("joi")
// Read the file contents
const database = JSON.parse(fs.readFileSync("./database.json"));

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
const port = 3000

// routes
app.get('/api', (request, res) => {
    res.send('Hello bot API')
})

// bot.send()
// console.log("send() called")

// server.get('/api/')
// server.post('/api/')
// server.patch('/api/')
// server.delete('/api/')

const saveJson = () => fs.writeFileSync("./database.json", JSON.stringify(database));

app.post('/api/register', async (req, res) => {
    try {
        // const {email,password,firstName,lastName} = req.body;
        await prisma.user.create({
            data: req.body
        })

    } catch (err) {
        res.status(400).send(err.message)
    }

    res.status(200).send('data saved succesfully')
})


app.listen(port, console.log(`Server is listenning on http://localhost:${port}/`)) //npm run devStart
