
interface Task {
    id: number;
    name: string;
    botId: number;
    chatUrl: string;
    message: string;
    datetime: Date;
    repeatingPattern: string;
  }
  
  export default Task;