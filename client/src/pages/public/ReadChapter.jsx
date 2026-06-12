import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function ReadChapter() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const load = () => {
    api.get(`/chapters/${chapterId}`).then((response) => setData(response.data));
    api.get(`/chapters/${chapterId}/comments`).then((response) => setComments(response.data.comments || []));
  };

  useEffect(() => { load(); }, [chapterId]);

  if (!data) return <div className="empty-state">Loading chapter...</div>;

  const action = async (type) => {
    if (!user) return toast.error("Please login first");
    try {
      if (type === "like") await api.post(`/chapters/${chapterId}/like`);
      if (type === "bookmark") await api.post(`/bookmarks/${chapterId}`);
      toast.success(type === "like" ? "Chapter liked" : "Bookmark saved");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/chapters/${chapterId}/comments`, { content: text });
      setText("");
      toast.success("Comment submitted for approval");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login required");
    }
  };

  const { chapter, previous, next } = data;

  return (
    <article className="reader">
      <Link className="back-link" to={`/novels/${chapter.novelId.slug}`}>← Back to novel</Link>
      <header className="reader-header">
        <span className="eyebrow">{chapter.novelId.title}</span>
        <h1>Chapter {chapter.chapterNumber}</h1>
        <h2>{chapter.title}</h2>
      </header>

      <div className="chapter-content">{chapter.content}</div>

      <div className="reader-actions">
        <button onClick={() => action("like")}>♡ Like ({chapter.likedBy.length})</button>
        <button className="secondary" onClick={() => action("bookmark")}>🔖 Save Bookmark</button>
      </div>

      <section className="comment-section">
        <div className="section-heading compact"><div><span className="eyebrow">DISCUSSION</span><h2>Reader Comments</h2></div></div>
        {comments.length === 0 && <p className="muted">No approved comments yet.</p>}
        {comments.map((comment) => <div className="comment" key={comment._id}><b>{comment.userId?.name || "Reader"}</b><p>{comment.content}</p></div>)}
        <form className="comment-form" onSubmit={submit}>
          <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Write your comment..." />
          <button>Submit Comment</button>
        </form>
      </section>

      <nav className="chapter-nav">
        {previous ? <Link className="button secondary" to={`/read/${previous._id}`}>← Previous</Link> : <span />}
        {next ? <Link className="button" to={`/read/${next._id}`}>Next →</Link> : <span />}
      </nav>
    </article>
  );
}
