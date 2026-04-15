import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../../api/client";
import AuthCard from "./AuthCard";
import FormField from "./FormField";

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (form.password !== form.confirm) errors.confirm = "Passwords do not match";
  return errors;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: undefined }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setServerError("");
    setLoading(true);
    try {
      const { data } = await client.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.detail ?? "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Start monitoring AI compliance today">
      {success ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">✓</div>
          <p className="text-green-400 font-medium text-center">{success}</p>
          <p className="text-slate-500 text-sm">Redirecting to login…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Full Name" type="text" placeholder="Jane Smith" value={form.name} onChange={set("name")} error={errors.name} required />
          <FormField label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} error={errors.email} required />
          <FormField label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} error={errors.password} required />
          <FormField label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} error={errors.confirm} required />

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
