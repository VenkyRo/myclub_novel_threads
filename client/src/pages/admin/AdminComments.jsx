import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadComments = async () => {
    try {
      const response = await api.get("/admin/comments");
      setComments(response.data.comments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load comments");
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const filteredComments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return comments.filter((comment) => {
      const text = [comment.content, comment.userId?.name, comment.userId?.email, comment.novelId?.title, comment.chapterId?.title].join(" ").toLowerCase();
      const matchesText = !query || text.includes(query);
      const matchesFilter = filter === "ALL" || comment.status === filter;
      return matchesText && matchesFilter;
    });
  }, [comments, search, filter]);

  const approve = async (comment) => {
    try {
      await api.patch(`/admin/comments/${comment._id}/approve`);
      toast.success("Comment approved");
      await loadComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const remove = async (comment) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/admin/comments/${comment._id}`);
      toast.success("Comment deleted");
      await loadComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Comment deletion failed");
    }
  };

  return (
    <>
      <section className="page-banner admin-page-banner"><span className="eyebrow">ADMIN PANEL</span><h1>Moderate Comments</h1><p>Approve reader discussions before they appear publicly.</p></section>
      <div className="toolbar">
        <input placeholder="Search comments" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">All comments</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select>
      </div>
      <div className="list">
        {filteredComments.map((comment) => (
          <div className="admin-card" key={comment._id}>
            <div>
              <h3>{comment.userId?.name || "Deleted user"}</h3>
              <p>{comment.content}</p>
              <p>{comment.novelId?.title || "Novel"} · Chapter {comment.chapterId?.chapterNumber || "-"}: {comment.chapterId?.title || "-"} · <b>{comment.status}</b></p>
            </div>
            <div className="action-row">
              {comment.status !== "APPROVED" && <button type="button" onClick={() => approve(comment)}>Approve</button>}
              <button type="button" className="danger" onClick={() => remove(comment)}>Delete</button>
            </div>
          </div>
        ))}
        {filteredComments.length === 0 && <p>No comments found.</p>}
      </div>
    </>
  );
}
