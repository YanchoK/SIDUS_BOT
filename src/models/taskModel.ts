interface Task {
  title: string,
  content: string,
  remindTime?: string,
  recurring?: string,
  user_id: number,
  bot_id: number,
  chat_id: number,
  sent: boolean
}

export default Task;