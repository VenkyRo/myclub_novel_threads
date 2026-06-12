import React from "react";
import { Link } from "react-router-dom";

export default function NovelCard({ novel }) {
  return (
    <article className="novel-card">
      <div className="cover-wrap">
        <img
          className="novel-cover"
          src={novel.coverImageUrl || "https://placehold.co/480x680?text=Novel+Threads"}
          alt={`${novel.title} cover`}
        />
        <span className="cover-badge">{novel.novelStatus === "COMPLETED" ? "Completed" : "Ongoing"}</span>
      </div>
      <div className="novel-card-body">
        <span className="pill">{novel.category || "Novel"}</span>
        <h3>{novel.title}</h3>
        <p>{novel.shortSummary}</p>
        <div className="novel-meta">
          <span>✍ {novel.author}</span>
          <span>👁 {novel.totalViews || 0}</span>
        </div>
        <Link className="button full-width" to={`/novels/${novel.slug}`}>Read Novel</Link>
      </div>
    </article>
  );
}
