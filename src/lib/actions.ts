'use server';
import { db } from '@/lib/drizzle';
import { todos } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export const getUserTodos = async (userId: number) => {
  return db.select().from(todos).where(eq(todos.userId, userId));
};

export const createTodo = async (data: {
  title: string;
  description?: string;
  userId: number;
  dueDate?: Date;
}) => {
  return db.insert(todos).values({
    title: data.title,
    description: data.description ?? '',
    userId: data.userId,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateTodoStatus = async (id: number, completed: boolean) => {
  return db.update(todos).set({ completed, updatedAt: new Date() }).where(eq(todos.id, id));
};

export const deleteTodo = async (id: string, userId: string) => {
  return db.delete(todos).where(
    and(
      eq(todos.id, Number(id)), 
      eq(todos.userId, Number(userId))
    )
  );
};
