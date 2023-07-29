import express from 'express';
import cors from 'cors';
import { initDriver, openPage, logIn, addCookies, sendMessage, openChat } from './bot.js';
import fs from 'fs';
import joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { startSheduler } from './scheduler.js';
// import v1UserRouter from './v1/routes/userRoutes.js';
import v1TaskRouter from './v1/routes/taskRoutes.js';
import v1ChatRouter from './v1/routes/chatRoutes.js';
import bodyParser from 'body-parser';
// import { swaggerDocs as V1SwaggerDocs } from "../dist/v1/swagger.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from './swagger.json';

// npm start
// npm run build
// npx prisma migrate dev (always stop the server in order to apply in the code)
// npx prisma db push

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
// app.use('/api/v1/users', v1UserRouter);
app.use('/api/v1/tasks', v1TaskRouter);
app.use('/api/v1/chats', v1ChatRouter);

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }', // This line removes the "Authorize" button
  };
app.use('/',swaggerUi.serve,swaggerUi.setup(swaggerDocument,swaggerOptions))

app.listen(port, () => { 
    console.log(`Server is listenning on http://localhost:${port}/`)
})