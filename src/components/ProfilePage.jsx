import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.new_password !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await client.put("/auth/change-password", {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setSuccess("Password updated successfully.");
      setForm({ current_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.detail ?? "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <button onClick={() => navigate(-1)} className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4">
          <p className="text-slate-400 text-sm">Signed in as</p>
          <p className="text-white font-medium">{user?.name}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Current password"
              value={form.current_password}
              onChange={set("current_password")}
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="New password"
              value={form.new_password}
              onChange={set("new_password")}
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={form.confirm}
              onChange={set("confirm")}
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        <button onClick={logout} className="mt-6 w-full text-sm text-slate-500 hover:text-red-400 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
