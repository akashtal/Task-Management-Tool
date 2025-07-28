'use client';

import { useState, useEffect } from 'react';
import { updateTodoStatus, deleteTodo } from '@/lib/actions';
import { notifyAdmin, notifyUserDue } from '@/lib/notify';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
};

type Props = {
  todos: Todo[];
  userEmail: string;
  userId: string;
};

export default function TodoList({ todos, userEmail, userId }: Props) {
  const [filter, setFilter] = useState<'all' | 'complete' | 'incomplete'>('all');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    return filter === 'complete' ? todo.completed : !todo.completed;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach((todo) => {
        if (!todo.completed && new Date(todo.dueDate) < now) {
          notifyUserDue(userEmail, todo.title);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [todos, userEmail]);

  const handleComplete = async (todo: Todo) => {
await updateTodoStatus(Number(todo.id), !todo.completed);
    if (!todo.completed) {
      await notifyAdmin(userEmail, todo.title);
    }
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id, userId);
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setFilter('all')}>
          All
        </Button>
        <Button variant="outline" onClick={() => setFilter('complete')}>
          Completed
        </Button>
        <Button variant="outline" onClick={() => setFilter('incomplete')}>
          Incomplete
        </Button>
      </div>

      {filteredTodos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleComplete(todo)}
              />
              <div>
                <p className={todo.completed ? 'line-through' : ''}>
                  {todo.title}
                </p>
                <small>Due: {new Date(todo.dueDate).toLocaleString()}</small>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
