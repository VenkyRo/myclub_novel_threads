import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage({ register = false }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/auth/${register ? "register" : "login"}`, form);
      login(response.data.token, response.data.user);
      toast.success(register ? "Account created" : "Welcome back");
      navigate(response.data.user.role === "ADMIN" ? "/admin/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-intro">
        <span className="eyebrow">NOVEL THREADS</span>
        <h1>{register ? "Join our reading community" : "Welcome back"}</h1>
        <p>{register ? "Create your account to save bookmarks, like chapters, and participate in reader discussions." : "Continue your reading journey and revisit the stories you love."}</p>
      </div>
      <form className="form auth-card" onSubmit={submit}>
        <h2>{register ? "Create Account" : "Login"}</h2>
        {register && <label>Name<input required placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
        <label>Email<input required type="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password<input required minLength="6" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button disabled={loading}>{loading ? "Please wait..." : register ? "Create Account" : "Login"}</button>
        <p className="auth-switch">{register ? <>Already registered? <Link to="/login">Login</Link></> : <>New reader? <Link to="/register">Create an account</Link></>}</p>
      </form>
    </section>
  );
}
