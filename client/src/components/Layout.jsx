import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === "ADMIN";
  const showAdminWorkspace = isAdmin && location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";
  const close = () => setOpen(false);

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/" onClick={close}>
            <span className="brand-mark">న</span>
            <span>
              <strong>Novel Threads</strong>
              <small>తెలుగు కథల ప్రపంచం</small>
            </span>
          </Link>

          <button
            className="menu-toggle"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav className={open ? "nav-links open" : "nav-links"}>
            <NavLink to="/" onClick={close}>
              Home
            </NavLink>
            <NavLink to="/novels" onClick={close}>
              Novels
            </NavLink>
            {user && !isAdmin && (
              <NavLink to="/bookmarks" onClick={close}>
                Bookmarks
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/dashboard" onClick={close}>
                Admin Panel
              </NavLink>
            )}
            {user ? (
              <div className="nav-user">
                <span className="nav-user-name">
                  👤 {user.name || user.email}
                </span>

                <button
                  className="nav-logout"
                  type="button"
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" onClick={close}>
                  Login
                </NavLink>
                <NavLink className="nav-cta" to="/register" onClick={close}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      {showAdminWorkspace ? (
        <div className="admin-workspace">
          <AdminSidebar />
          <main className="admin-main">{children}</main>
        </div>
      ) : (
        <main className="container">{children}</main>
      )}

      {!showAdminWorkspace && (
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <h3>Novel Threads</h3>
              <p>తెలుగు నవలలను ప్రేమించే పాఠకుల కోసం.</p>
            </div>
            <span>© {new Date().getFullYear()} Novel Threads</span>
          </div>
        </footer>
      )}
    </div>
  );
}
