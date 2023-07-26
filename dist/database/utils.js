import fs from 'fs';
const Utils = {
    async saveToDatabase(DB) {
        const filePath = 'D:\\1. Programming\\Projects\\Messenger-bot-API\\src\\database\\db.json';
        fs.writeFileSync(filePath, JSON.stringify(DB, null, 2), {
            encoding: "utf-8",
        });
    }
};
export default Utils;
//# sourceMappingURL=utils.js.map