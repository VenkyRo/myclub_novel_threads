import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/admin/dashboard", icon: "⌂", label: "Dashboard", text: "Overview and shortcuts" },
  { to: "/admin/novels", icon: "📚", label: "Novels & Chapters", text: "Create, edit, publish stories" },
  { to: "/admin/users", icon: "👥", label: "Readers", text: "Ban, unban, or remove users" },
  { to: "/admin/comments", icon: "💬", label: "Comments", text: "Approve or delete comments" },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title">
        <span>ADMIN PANEL</span>
        <strong>Control Centre</strong>
      </div>
      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "admin-side-link active" : "admin-side-link"}>
            <span className="admin-side-icon">{item.icon}</span>
            <span><b>{item.label}</b><small>{item.text}</small></span>
          </NavLink>
        ))}
      </nav>
      <div className="admin-help-box">
        <b>Start here</b>
        <span>Open “Novels & Chapters” to create a novel, upload the cover, publish it, and add Telugu chapters.</span>
      </div>
    </aside>
  );
}
