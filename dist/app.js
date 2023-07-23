import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { startSheduler } from './scheduler.js';
import v1UserRouter from './v1/routes/userRoutes.js';
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
const port = 3000;
startSheduler();
app.use('/api/v1/users', v1UserRouter);
app.listen(port, () => { console.log(`Server is listenning on http://localhost:${port}/`); });
//# sourceMappingURL=app.js.map