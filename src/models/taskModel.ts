interface Task {
  title: string,
  content: string,
  remindTime?: string,
  recurring?: string,
  user_id: number,
  bot_id: number,
  chatUrl_id: number,
  sent: boolean,
  updatedAt: Date
}

export default Task;