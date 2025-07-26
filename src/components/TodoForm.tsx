'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  userId: number;
  onTodoCreated?: () => void;
}

export default function TodoForm({ userId, onTodoCreated }: TodoFormProps) {
  const { register, handleSubmit, formState, reset } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = async (data: TodoFormValues) => {
    try {
      const res = await fetch('/api/todos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      });
      
      if (res.ok) {
        toast.success('Todo created successfully');
        reset();
        onTodoCreated?.();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create todo');
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input placeholder="Task Title" {...register('title')} />
      <Input placeholder="Description (optional)" {...register('description')} />
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
}
