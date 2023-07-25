import TaskModel from "../models/taskModel.js";
import { readFile, writeFile } from 'fs/promises';
import fs from 'fs'

const Utils = {
    async saveToDatabase(DB: any) {
        const filePath = 'D:\\1. Programming\\Projects\\Messenger-bot-API\\src\\database\\db.json'
        // try {
        //     const data = await readFile(filePath, 'utf8');
        //     const jsonData = JSON.parse(data);

        //     if (!jsonData.task) jsonData.task = [];
        //     jsonData.task.push(task);

        //     await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        //     console.log('New task added successfully!');
        // } catch (err) {
        //     console.error('Error:', err);
        // }

        fs.writeFileSync(filePath, JSON.stringify(DB, null, 2), {
            encoding: "utf-8",
        });
    }
}
export default Utils