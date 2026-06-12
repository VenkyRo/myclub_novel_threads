import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import NovelCard from "../../components/NovelCard";

export default function Home() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/novels?limit=6")
      .then((response) => setNovels(response.data.novels || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">TELUGU DIGITAL LIBRARY</span>
          <h1>ప్రతి కథలో ఒక కొత్త ప్రపంచం</h1>
          <p>మీకు నచ్చిన తెలుగు నవలలను చదవండి. కొత్త అధ్యాయాలను అనుసరించండి. మీ మనసుకు దగ్గరైన కథలను బుక్‌మార్క్ చేసుకోండి.</p>
          <div className="hero-actions">
            <Link className="button" to="/novels">Explore Novels</Link>
            <Link className="button ghost" to="/register">Join as Reader</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="book-stack book-one">కథ</div>
          <div className="book-stack book-two">నవల</div>
          <div className="book-stack book-three">తెలుగు</div>
        </div>
      </section>

      <section className="feature-strip">
        <div><b>📚</b><span>Curated Telugu Novels</span></div>
        <div><b>📱</b><span>Comfortable Mobile Reading</span></div>
        <div><b>🔖</b><span>Likes, Bookmarks & Comments</span></div>
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">LATEST STORIES</span>
          <h2>Newly Published Novels</h2>
        </div>
        <Link className="text-link" to="/novels">View all novels →</Link>
      </section>

      {loading ? (
        <div className="empty-state">Loading novels...</div>
      ) : novels.length ? (
        <section className="novel-grid">{novels.map((novel) => <NovelCard key={novel._id} novel={novel} />)}</section>
      ) : (
        <div className="empty-state"><b>No published novels yet.</b><span>New stories will appear here soon.</span></div>
      )}
    </>
  );
}
