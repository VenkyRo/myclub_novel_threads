import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import AdminNovels from "./AdminNovels";

const labels = {
  totalNovels: ["Total novels", "📚"],
  publishedNovels: ["Published novels", "✓"],
  draftNovels: ["Draft novels", "✎"],
  totalChapters: ["Total chapters", "☰"],
  publishedChapters: ["Published chapters", "✓"],
  draftChapters: ["Draft chapters", "✎"],
  totalUsers: ["Registered readers", "👥"],
  bannedUsers: ["Banned readers", "⊘"],
  pendingComments: ["Pending comments", "💬"],
  approvedComments: ["Approved comments", "✓"],
  totalBookmarks: ["Bookmarks", "🔖"],
  totalViews: ["Chapter views", "👁"],
  totalLikes: ["Likes", "♡"],
};

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");
      const response = await api.get("/admin/dashboard");
      setStats(response.data.stats || {});
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <section className="admin-hero">
        <div>
          <span className="eyebrow">WEBSITE CONTROL PANEL</span>
          <h1>Manage Novel Threads</h1>
          <p>Create novels, upload covers, add Telugu chapters, publish stories, manage readers, and approve comments from your admin area.</p>
        </div>
        <div className="action-row">
          <a className="button" href="#novel-manager">+ Create Novel</a>
          <Link className="button secondary" to="/admin/users">Manage Readers</Link>
          <Link className="button secondary" to="/admin/comments">Approve Comments</Link>
        </div>
      </section>

      {error && <p className="error-box">{error}</p>}

      <section className="stats">
        {Object.entries(labels).map(([key, [label, icon]]) => (
          <div className="stat-card" key={key}>
            <span className="stat-icon">{icon}</span>
            <b>{stats[key] ?? 0}</b>
            <small>{label}</small>
          </div>
        ))}
      </section>

      <section className="admin-actions-grid">
        <a className="admin-action-card primary" href="#novel-manager">
          <span>📚</span>
          <div>
            <h3>Create Novels & Chapters</h3>
            <p>Create a story, publish it, and add unlimited Telugu chapters directly below.</p>
            <b>Open manager ↓</b>
          </div>
        </a>
        <Link className="admin-action-card" to="/admin/users">
          <span>👥</span>
          <div>
            <h3>Manage Readers</h3>
            <p>Search readers, ban or unban accounts, and remove users.</p>
            <b>Open reader controls →</b>
          </div>
        </Link>
        <Link className="admin-action-card" to="/admin/comments">
          <span>💬</span>
          <div>
            <h3>Moderate Comments</h3>
            <p>Review pending comments and approve or delete them.</p>
            <b>Open comment controls →</b>
          </div>
        </Link>
      </section>

      <section id="novel-manager" className="dashboard-manager-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DIRECT ADMIN CONTROLS</span>
            <h2>Create Novels and Add Chapters</h2>
          </div>
          <button type="button" className="secondary" onClick={loadDashboard}>Refresh Analytics</button>
        </div>
        <AdminNovels />
      </section>
    </>
  );
}
