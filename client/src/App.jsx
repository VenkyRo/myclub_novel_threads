import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/public/Home";
import Novels from "./pages/public/Novels";
import NovelDetails from "./pages/public/NovelDetails";
import ReadChapter from "./pages/public/ReadChapter";
import AuthPage from "./pages/public/AuthPage";
import Bookmarks from "./pages/public/Bookmarks";
import Dashboard from "./pages/admin/Dashboard";
import AdminNovels from "./pages/admin/AdminNovels";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminComments from "./pages/admin/AdminComments";

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/novels" element={<Novels />} />
    <Route path="/novels/:slug" element={<NovelDetails />} />
    <Route path="/read/:chapterId" element={<ReadChapter />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage register />} />
    <Route path="/admin/login" element={<AuthPage />} />
    <Route path="/bookmarks" element={<RequireAuth><Bookmarks /></RequireAuth>} />
    <Route path="/admin/dashboard" element={<RequireAuth admin><Dashboard /></RequireAuth>} />
    <Route path="/admin/novels" element={<RequireAuth admin><AdminNovels /></RequireAuth>} />
    <Route path="/admin/users" element={<RequireAuth admin><AdminUsers /></RequireAuth>} />
    <Route path="/admin/comments" element={<RequireAuth admin><AdminComments /></RequireAuth>} />
    <Route path="*" element={<section className="empty-state not-found"><b>404</b><span>Page not found</span><Link className="button" to="/">Back to Home</Link></section>} />
  </Routes></Layout>;
}
