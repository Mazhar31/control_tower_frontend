import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const RISK_COLOR = {
  Critical: "text-red-400",
  High: "text-orange-400",
  Medium: "text-yellow-400",
  Low: "text-green-400",
};

function UserAssessmentRow({ group }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className={`text-slate-400 text-xs transition-transform duration-200 ${open ? "rotate-90" : ""}`}>▶</span>
          <div className="text-left">
            <p className="text-white text-sm font-medium">{group.user_name}</p>
            <p className="text-slate-500 text-xs">{group.user_email}</p>
          </div>
        </div>
        <span className="text-slate-500 text-xs">{group.items.length} assessment{group.items.length !== 1 ? "s" : ""}</span>
      </button>
      {open && (
        <div className="border-t border-slate-800/60 bg-slate-950/40">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800/60">
                <th className="text-left px-8 py-2 font-medium">Company / System</th>
                <th className="text-left px-4 py-2 font-medium">Risk</th>
                <th className="text-left px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium text-right">Report</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((a) => (
                <tr key={a.id} className="border-b border-slate-800/30 hover:bg-slate-800/20">
                  <td className="px-8 py-2">
                    <p className="text-slate-200 font-medium">{a.company_name}</p>
                    <p className="text-slate-500">{a.system_name}</p>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`font-semibold ${RISK_COLOR[a.risk_tier] ?? "text-slate-400"}`}>
                      {a.risk_tier ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-400 whitespace-nowrap">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {a.report_url ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <a
                          href={a.report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                          Download ↗
                        </a>
                        <span className="text-slate-600 text-[10px]">Expires in 24h</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">No report</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchUsers(); fetchAssessments(); }, []);

  function showMessage(setter, msg) {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  }

  async function fetchUsers() {
    try {
      const { data } = await client.get("/admin/users");
      setUsers(data);
    } catch {
      showMessage(setError, "Failed to load users.");
    }
  }

  async function fetchAssessments() {
    try {
      const { data } = await client.get("/admin/assessments");
      setAssessments(data);
    } catch {
      showMessage(setError, "Failed to load assessments.");
    }
  }

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await client.post("/admin/users", form);
      showMessage(setSuccess, `User created. Default password: Qwerty@123`);
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      showMessage(setError, err.response?.data?.detail ?? "Failed to create user.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await client.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      showMessage(setError, "Failed to delete user.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <button onClick={logout} className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>

        {/* Add User Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={set("name")}
              required
              className="flex-1 min-w-[160px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set("email")}
              required
              className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? "Adding…" : "Add User"}
            </button>
          </form>

          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
          {success && <p className="mt-3 text-green-400 text-sm">{success}</p>}
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <h2 className="text-lg font-semibold px-6 py-4 border-b border-slate-800">Users</h2>
          {users.length === 0 ? (
            <p className="text-slate-500 text-sm px-6 py-6">No users yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-6 py-3 text-white">{u.name}</td>
                    <td className="px-6 py-3 text-slate-300">{u.email}</td>
                    <td className="px-6 py-3 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Assessments Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-8">
          <h2 className="text-lg font-semibold px-6 py-4 border-b border-slate-800">Assessment Reports</h2>
          {assessments.length === 0 ? (
            <p className="text-slate-500 text-sm px-6 py-6">No assessments yet.</p>
          ) : (() => {
            // Group by user email
            const grouped = assessments.reduce((acc, a) => {
              const key = a.user_email;
              if (!acc[key]) acc[key] = { user_name: a.user_name, user_email: a.user_email, items: [] };
              acc[key].items.push(a);
              return acc;
            }, {});
            return (
              <div className="divide-y divide-slate-800">
                {Object.values(grouped).map((group) => (
                  <UserAssessmentRow key={group.user_email} group={group} />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
