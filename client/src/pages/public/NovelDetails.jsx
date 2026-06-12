import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/client";

export default function NovelDetails() {
  const { slug } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/novels/${slug}`)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || "Novel not found"));
  }, [slug]);

  if (error) return <div className="error-box">{error}</div>;
  if (!data) return <div className="empty-state">Loading novel...</div>;

  const { novel, chapters } = data;

  return (
    <>
      <Link className="back-link" to="/novels">← Back to novels</Link>
      <section className="novel-details">
        <img className="details-cover" src={novel.coverImageUrl || "https://placehold.co/480x680?text=Novel+Threads"} alt={`${novel.title} cover`} />
        <div className="details-content">
          <span className="pill">{novel.category}</span>
          <h1>{novel.title}</h1>
          <p className="lead">{novel.description || novel.shortSummary}</p>
          <div className="details-stats">
            <div><b>{novel.author}</b><span>Author</span></div>
            <div><b>{novel.novelStatus === "COMPLETED" ? "Completed" : "Ongoing"}</b><span>Status</span></div>
            <div><b>{chapters.length}</b><span>Chapters</span></div>
            <div><b>{novel.totalViews || 0}</b><span>Views</span></div>
          </div>
        </div>
      </section>

      <section className="section-heading chapter-heading">
        <div><span className="eyebrow">READ NOW</span><h2>Published Chapters</h2></div>
      </section>

      <div className="chapter-list">
        {chapters.map((chapter) => (
          <Link key={chapter._id} to={`/read/${chapter._id}`}>
            <span className="chapter-number">{String(chapter.chapterNumber).padStart(2, "0")}</span>
            <span><b>Chapter {chapter.chapterNumber}</b><small>{chapter.title}</small></span>
            <span className="chapter-arrow">→</span>
          </Link>
        ))}
        {chapters.length === 0 && <div className="empty-state">No published chapters yet.</div>}
      </div>
    </>
  );
}
