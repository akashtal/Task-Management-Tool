export const notifyAdmin = async (email: string, task: string) => {
  console.log(`🔔 Notify Admin: ${email} completed task "${task}"`);
};

export const notifyUserDue = async (email: string, task: string) => {
  console.log(`⚠️ Reminder: ${task} is due soon for ${email}`);
};

export const notifyPendingTodos = async (email: string, pendingCount: number) => {
  console.log(`📋 Notification: ${email} has ${pendingCount} pending todos`);
};

export const notifyTodoCreated = async (email: string, task: string) => {
  console.log(`✅ Notification: New todo "${task}" created for ${email}`);
};

export const notifyTodoCompleted = async (email: string, task: string) => {
  console.log(`🎉 Notification: Todo "${task}" completed by ${email}`);
};
