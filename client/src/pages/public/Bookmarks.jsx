import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

export default function Bookmarks() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/bookmarks").then((response) => setItems(response.data.bookmarks || [])); }, []);

  return (
    <>
      <section className="page-banner"><span className="eyebrow">YOUR LIBRARY</span><h1>Saved Bookmarks</h1><p>Continue reading your favourite chapters.</p></section>
      <div className="chapter-list">
        {items.map((bookmark) => <Link key={bookmark._id} to={`/read/${bookmark.chapterId._id}`}><span className="chapter-number">🔖</span><span><b>{bookmark.novelId.title}</b><small>Chapter {bookmark.chapterId.chapterNumber}: {bookmark.chapterId.title}</small></span><span className="chapter-arrow">→</span></Link>)}
        {items.length === 0 && <div className="empty-state">You have not saved any bookmarks yet.</div>}
      </div>
    </>
  );
}
