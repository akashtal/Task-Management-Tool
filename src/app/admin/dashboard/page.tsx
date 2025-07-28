'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, Users, LogOut, Check, X, ListTodo } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from 'sonner';
import { z } from 'zod';

const userSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  email: z.string().email(),
  approved: z.boolean(),
  role: z.enum(['admin', 'user']),
  createdAt: z.string().or(z.date()).transform((val) =>
    val instanceof Date ? val.toISOString() : val
  ),
});

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  userEmail: z.string().email().nullable(),
  completed: z.boolean(),
});

type User = z.infer<typeof userSchema>;
type Todo = z.infer<typeof todoSchema>;

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const [todoPage, setTodoPage] = useState(1);
  const todosPerPage = 6;

  const paginatedTodos = todos.slice(
    (todoPage - 1) * todosPerPage,
    todoPage * todosPerPage
  );

  const totalTodoPages = Math.ceil(todos.length / todosPerPage);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [usersRes, todosRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/todos'),
      ]);

      const usersJson = await usersRes.json();
      const todosJson = await todosRes.json();

      const parsedUsers = z.array(userSchema).safeParse(usersJson);
      const parsedTodos = z.array(todoSchema).safeParse(todosJson);

      if (parsedUsers.success) setUsers(parsedUsers.data);
      if (parsedTodos.success) setTodos(parsedTodos.data);
    } catch (error) {
      toast.error('Failed to fetch admin data.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserApproval = async (
    userId: number,
    status: 'approved' | 'rejected'
  ) => {
    try {
      const res = await fetch('/api/admin/user-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });

      if (!res.ok) throw new Error('Failed to update user status');

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, approved: status === 'approved' } : u
        )
      );

      toast.success(`User ${status} successfully.`);
    } catch (err) {
      toast.error(`Failed to ${status} user.`);
      console.error('Update error:', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-muted px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Shield className="text-red-600" />
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">{session.user.email}</Badge>
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      {/* User Management Section */}
      <Card className="mb-8 shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5 text-muted-foreground" />
            User Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{users.length} registered users</p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="break-words max-w-[150px]">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.approved ? 'default' : 'secondary'}>
                      {user.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    {!user.approved ? (
                      <Button size="sm" onClick={() => updateUserApproval(user.id, 'approved')}>
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateUserApproval(user.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Todos Section with Pagination */}
      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ListTodo className="w-5 h-5 text-muted-foreground" />
            User Todos (Read-Only)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{todos.length} total todos</p>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No todos available</p>
          ) : (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className="border rounded-xl p-4 bg-white dark:bg-background shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-lg break-words">{todo.title}</h3>
                      <Badge variant="secondary">{todo.userEmail || 'Unknown'}</Badge>
                      <Badge variant={todo.completed ? 'default' : 'secondary'}>
                        {todo.completed ? 'Completed' : 'Incomplete'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm break-words">
                      {todo.description}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              {totalTodoPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setTodoPage((prev) => Math.max(prev - 1, 1));
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalTodoPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={todoPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setTodoPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setTodoPage((prev) => Math.min(prev + 1, totalTodoPages));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
