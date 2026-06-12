import React, { useEffect, useState } from "react";
import api from "../../api/client";
import NovelCard from "../../components/NovelCard";

export default function Novels() {
  const [novels, setNovels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/novels", { params: { search } });
      setNovels(response.data.novels || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load novels. Check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <section className="page-banner">
        <span className="eyebrow">OUR COLLECTION</span>
        <h1>Browse Telugu Novels</h1>
        <p>Discover thrillers, romance, family dramas, and more.</p>
      </section>

      <form className="search-panel" onSubmit={(event) => { event.preventDefault(); load(); }}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or author..." />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="empty-state">Loading novels...</div>}
      {!loading && error && <div className="error-box">{error}</div>}
      {!loading && !error && novels.length === 0 && <div className="empty-state"><b>No novels found.</b><span>Try another search term.</span></div>}
      {!loading && !error && novels.length > 0 && <section className="novel-grid">{novels.map((novel) => <NovelCard key={novel._id} novel={novel} />)}</section>}
    </>
  );
}
