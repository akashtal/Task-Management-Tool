import { Button } from "@/components/ui/button";

export function UserList({ users }: { users: any[] }) {
  if (!users.length) return <div>No pending users.</div>;
  const handleApprove = async (userId: number, approve: boolean) => {
    await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ userId, approve }),
    });
    window.location.reload();
  };
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-2 border rounded">
          <div>{user.email}</div>
          <div className="space-x-2">
            <Button onClick={() => handleApprove(user.id, true)}>Approve</Button>
            <Button variant="destructive" onClick={() => handleApprove(user.id, false)}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
} 