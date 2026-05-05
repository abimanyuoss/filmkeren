import { UserPlus } from "lucide-react";
import { toggleUserAccess } from "@/app/actions";
import { PageHeader, PrimaryButton, UserRow } from "@/components/ui";
import { getUsers } from "@/lib/db";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <>
      <PageHeader
        action={
          <PrimaryButton>
            <UserPlus size={18} />
            Add New User
          </PrimaryButton>
        }
        eyebrow="Access"
        title="User Roles & Management"
      />

      <section className="panel table-panel">
        <div className="panel-heading">
          <h2>System Administrators</h2>
          <select aria-label="Filter role" className="compact-select" defaultValue="All Roles">
            <option>All Roles</option>
            <option>Admin</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th className="center">System Access</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow action={toggleUserAccess} key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
