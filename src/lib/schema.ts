import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user'), // 'admin' or 'user'
  approved: boolean('approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
