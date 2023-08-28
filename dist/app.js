import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import v1UserRouter from './v1/routes/userRoutes.js';
import v1TaskRouter from './v1/routes/taskRoutes.js';
import v1ChatRouter from './v1/routes/chatRoutes.js';
import v1BotRouter from './v1/routes/botRoutes.js';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import AutoBot from './bot_puppeteer.js';
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
const port = 3000;
app.use(bodyParser.json());
app.use('/api/v1/users', v1UserRouter);
app.use('/api/v1/tasks', v1TaskRouter);
app.use('/api/v1/chats', v1ChatRouter);
app.use('/api/v1/bots', v1BotRouter);
const bot = new AutoBot();
const main = async () => {
    console.log("requested!");
    await bot.main(1);
};
app.get('/api/v1/r', main);
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
};
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.listen(port, () => {
    console.log(`Server is listenning on http://localhost:${port}/`);
});
//# sourceMappingURL=app.js.map