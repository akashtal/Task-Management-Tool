'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, Edit, LogOut, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import TodoForm from '@/components/TodoForm';
import TodoNotification from '@/components/TodoNotification';
import EditTodoModal from '@/components/EditTodoModal';
import { ModeToggle } from '@/components/ModeToggle';

type TodoType = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      console.log('No session, redirecting to login');
      router.push('/auth/login');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user) {
      console.log('Session found, fetching todos for user:', session.user.id);
      fetchTodos();
      testAuth();
      testDatabase();
    }
  }, [session]);

  const testAuth = async () => {
    try {
      const res = await fetch('/api/test-auth');
      const data = await res.json();
      setDebugInfo(data);
      console.log('Auth test result:', data);
    } catch (error) {
      console.error('Auth test error:', error);
    }
  };

  const testDatabase = async () => {
    try {
      const res = await fetch('/api/test-db');
      const data = await res.json();
      setDbInfo(data);
      console.log('Database test result:', data);
    } catch (error) {
      console.error('Database test error:', error);
    }
  };

  const fetchTodos = async () => {
    if (!session?.user?.id) {
      console.log('No user ID in session');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to fetch todos:', errorData);
        throw new Error(errorData.error || 'Failed to fetch');
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Fetch todos error:', err);
      toast.error('Failed to fetch todos');
    }
    setLoading(false);
  };

  const toggleComplete = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        fetchTodos();
        toast.success('Todo updated successfully');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to update todo');
      }
    } catch (error) {
      console.error('Toggle complete error:', error);
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTodos();
        toast.success('Todo deleted successfully');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to delete todo');
      }
    } catch (error) {
      console.error('Delete todo error:', error);
      toast.error('Failed to delete todo');
    }
  };

  const openEditModal = (todo: TodoType) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" /> Welcome, {session.user.email}
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TodoForm userId={Number(session.user.id)} onTodoCreated={fetchTodos} />

          {todos.length > 0 && (
            <TodoNotification todos={todos} userEmail={session.user.email || ''} />
          )}

          <h3 className="font-semibold">My Todos</h3>
          {loading ? (
            <p>Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="text-gray-500">No todos found.</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between items-center border rounded p-2"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo.id)}
                  />
                  <div>
                    <p className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-xs text-muted-foreground">
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(todo)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={fetchTodos}
        />
      )}
    </main>
  );
}
