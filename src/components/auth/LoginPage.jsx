import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import AuthCard from "./AuthCard";
import FormField from "./FormField";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await client.post("/auth/login", form);
      login(data.access_token, data.name, data.role);
      navigate(data.role === "admin" ? "/admin" : "/intake");
    } catch (err) {
      setError(err.response?.data?.detail ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your TAIGA compliance account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} required />
        <FormField label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="text-center text-slate-500 text-sm">
          No account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">Create one</Link>
        </p>
      </form>
    </AuthCard>
  );
}
