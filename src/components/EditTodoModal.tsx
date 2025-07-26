'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditTodoModalProps {
  todo: {
    id: number;
    title: string;
    description: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditTodoModal({ todo, isOpen, onClose, onSave }: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        toast.success('Todo updated successfully');
        onSave();
        onClose();
      } else {
        toast.error('Failed to update todo');
      }
    } catch (error) {
      toast.error('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Edit Todo</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 