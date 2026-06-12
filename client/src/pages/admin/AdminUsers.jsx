import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesText = !query || [user.name, user.email].some((value) => String(value || "").toLowerCase().includes(query));
      const matchesFilter = filter === "ALL" || (filter === "BANNED" ? user.isBanned : !user.isBanned);
      return matchesText && matchesFilter;
    });
  }, [users, search, filter]);

  const toggleBan = async (user) => {
    try {
      if (user.isBanned) {
        await api.patch(`/admin/users/${user._id}/unban`);
        toast.success("User unbanned");
      } else {
        const reason = window.prompt("Enter the required ban reason:");
        if (!reason?.trim()) return toast.error("Ban reason is required");
        await api.patch(`/admin/users/${user._id}/ban`, { reason: reason.trim() });
        toast.success("User banned");
      }
      await loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "User update failed");
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete reader account “${user.name}”?`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success("User deleted");
      await loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "User deletion failed");
    }
  };

  return (
    <>
      <section className="page-banner admin-page-banner"><span className="eyebrow">ADMIN PANEL</span><h1>Manage Readers</h1><p>Search, review, ban, unban, or remove reader accounts.</p></section>
      <div className="toolbar">
        <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">All readers</option><option value="ACTIVE">Active</option><option value="BANNED">Banned</option></select>
      </div>
      <div className="list">
        {filteredUsers.map((user) => (
          <div className="admin-card" key={user._id}>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p><b>{user.isBanned ? "BANNED" : "ACTIVE"}</b>{user.banReason ? ` · Reason: ${user.banReason}` : ""}</p>
            </div>
            <div className="action-row">
              <button type="button" className="secondary" onClick={() => toggleBan(user)}>{user.isBanned ? "Unban" : "Ban"}</button>
              <button type="button" className="danger" onClick={() => deleteUser(user)}>Delete</button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && <p>No readers found.</p>}
      </div>
    </>
  );
}
