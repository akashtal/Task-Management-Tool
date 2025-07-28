'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, Edit, LogOut, } from 'lucide-react';
import { toast } from 'sonner';
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
  const [currentPage, setCurrentPage] = useState(1);
const todosPerPage = 3;

const totalPages = Math.ceil(todos.length / todosPerPage);
const paginatedTodos = todos.slice(
  (currentPage - 1) * todosPerPage,
  currentPage * todosPerPage
);


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
    console.log('Auth test result:', data);
    toast.success('Auth check successful');
  } catch (error) {
    console.error('Auth test error:', error);
    toast.error('Auth check failed');
  }
};


const testDatabase = async () => {
  try {
    const res = await fetch('/api/test-db');
    const data = await res.json();
    console.log('Database test result:', data);
    toast.success('Database connection successful');
  } catch (error) {
    console.error('Database test error:', error);
    toast.error('Database check failed');
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
toast.error('Failed to fetch todos');
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
<main className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
  <Card>
    <CardHeader>
      <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-600" />
          <span className="break-all text-sm sm:text-base">Welcome, {session.user.email}</span>
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

      <h3 className="font-semibold text-lg">My Todos</h3>

      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className="text-gray-500">No todos found.</p>
      ) : (
        <>
          {paginatedTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded p-3 gap-2"
            >
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleComplete(todo.id)}
                />
                <div>
                  <p className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="text-xs text-muted-foreground break-words">
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
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
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </>
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
