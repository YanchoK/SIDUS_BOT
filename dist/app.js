import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { startSheduler } from './scheduler.js';
import v1UserRouter from './v1/routes/userRoutes.js';
import v1TaskRouter from './v1/routes/taskRoutes.js';
import v1ChatRouter from './v1/routes/chatRoutes.js';
import v1BotRouter from './v1/routes/botRoutes.js';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
const port = 3000;
startSheduler();
app.use(bodyParser.json());
app.use('/api/v1/users', v1UserRouter);
app.use('/api/v1/tasks', v1TaskRouter);
app.use('/api/v1/chats', v1ChatRouter);
app.use('/api/v1/bots', v1BotRouter);
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
};
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.listen(port, () => {
    console.log(`Server is listenning on http://localhost:${port}/`);
});
//# sourceMappingURL=app.js.map