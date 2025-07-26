'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

interface TodoNotificationProps {
  todos: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
  userEmail: string;
}

export default function TodoNotification({ todos, userEmail }: TodoNotificationProps) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const pending = todos.filter(todo => !todo.completed).length;
    setPendingCount(pending);
  }, [todos]);

  if (pendingCount === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-yellow-600" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-yellow-800">
            You have {pendingCount} pending {pendingCount === 1 ? 'task' : 'tasks'}
          </span>
          <Badge variant="secondary">{pendingCount}</Badge>
        </div>
      </CardContent>
    </Card>
  );
} 