import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

const emptyNovel = {
  title: "",
  author: "",
  category: "",
  shortSummary: "",
  description: "",
  tags: "",
  novelStatus: "ONGOING",
  publishStatus: "DRAFT",
};

const emptyChapter = {
  chapterNumber: "",
  title: "",
  content: "",
  publishStatus: "DRAFT",
};

export default function AdminNovels() {
  const [novels, setNovels] = useState([]);
  const [novelForm, setNovelForm] = useState(emptyNovel);
  const [coverImage, setCoverImage] = useState(null);
  const [editingNovelId, setEditingNovelId] = useState("");
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterForm, setChapterForm] = useState(emptyChapter);
  const [editingChapterId, setEditingChapterId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const loadNovels = async () => {
    try {
      const response = await api.get("/admin/novels");
      setNovels(response.data.novels || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load novels");
    }
  };

  const loadChapters = async (novel) => {
    setSelectedNovel(novel);
    try {
      const response = await api.get(`/admin/novels/${novel._id}/chapters`);
      setChapters(response.data.chapters || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load chapters");
    }
  };

  useEffect(() => {
    loadNovels();
  }, []);

  const filteredNovels = useMemo(() => {
    const query = search.trim().toLowerCase();
    return novels.filter((novel) => {
      const matchesText = !query || [novel.title, novel.author, novel.category]
        .some((value) => String(value || "").toLowerCase().includes(query));
      const matchesFilter = filter === "ALL" || novel.publishStatus === filter;
      return matchesText && matchesFilter;
    });
  }, [novels, search, filter]);

  const resetNovelForm = () => {
    setNovelForm(emptyNovel);
    setCoverImage(null);
    setEditingNovelId("");
    setFileKey((value) => value + 1);
  };

  const submitNovel = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(novelForm).forEach(([key, value]) => formData.append(key, value));
      if (coverImage) formData.append("coverImage", coverImage);

      if (editingNovelId) {
        await api.put(`/admin/novels/${editingNovelId}`, formData);
        toast.success("Novel updated");
      } else {
        await api.post("/admin/novels", formData);
        toast.success("Novel created");
      }
      resetNovelForm();
      await loadNovels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Novel save failed");
    } finally {
      setLoading(false);
    }
  };

  const startNovelEdit = (novel) => {
    setEditingNovelId(novel._id);
    setNovelForm({
      title: novel.title || "",
      author: novel.author || "",
      category: novel.category || "",
      shortSummary: novel.shortSummary || "",
      description: novel.description || "",
      tags: (novel.tags || []).join(", "),
      novelStatus: novel.novelStatus || "ONGOING",
      publishStatus: novel.publishStatus || "DRAFT",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleNovel = async (novel) => {
    try {
      await api.patch(`/admin/novels/${novel._id}/publish`);
      toast.success(novel.publishStatus === "PUBLISHED" ? "Novel unpublished" : "Novel published");
      await loadNovels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Publish update failed");
    }
  };

  const deleteNovel = async (novel) => {
    if (!window.confirm(`Delete “${novel.title}” and all its chapters?`)) return;
    try {
      await api.delete(`/admin/novels/${novel._id}`);
      if (selectedNovel?._id === novel._id) {
        setSelectedNovel(null);
        setChapters([]);
      }
      toast.success("Novel deleted");
      await loadNovels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Novel deletion failed");
    }
  };

  const resetChapterForm = () => {
    setChapterForm(emptyChapter);
    setEditingChapterId("");
  };

  const submitChapter = async (event) => {
    event.preventDefault();
    if (!selectedNovel) return;
    try {
      const payload = {
        ...chapterForm,
        chapterNumber: Number(chapterForm.chapterNumber),
      };
      if (editingChapterId) {
        await api.put(`/admin/chapters/${editingChapterId}`, payload);
        toast.success("Chapter updated");
      } else {
        await api.post(`/admin/novels/${selectedNovel._id}/chapters`, payload);
        toast.success("Chapter created");
      }
      resetChapterForm();
      await loadChapters(selectedNovel);
      await loadNovels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Chapter save failed");
    }
  };

  const startChapterEdit = (chapter) => {
    setEditingChapterId(chapter._id);
    setChapterForm({
      chapterNumber: String(chapter.chapterNumber),
      title: chapter.title || "",
      content: chapter.content || "",
      publishStatus: chapter.publishStatus || "DRAFT",
    });
  };

  const toggleChapter = async (chapter) => {
    try {
      await api.patch(`/admin/chapters/${chapter._id}/publish`);
      toast.success(chapter.publishStatus === "PUBLISHED" ? "Chapter unpublished" : "Chapter published");
      await loadChapters(selectedNovel);
      await loadNovels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Chapter publish update failed");
    }
  };

  const deleteChapter = async (chapter) => {
    if (!window.confirm(`Delete chapter ${chapter.chapterNumber}: ${chapter.title}?`)) return;
    try {
      await api.delete(`/admin/chapters/${chapter._id}`);
      toast.success("Chapter deleted");
      await loadChapters(selectedNovel);
      await loadNovels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Chapter deletion failed");
    }
  };

  return (
    <>
      <section className="page-banner admin-page-banner">
        <span className="eyebrow">ADMIN PANEL</span>
        <h1>Manage Novels</h1>
        <p>Create, edit, publish, delete, and open a novel to manage its chapters.</p>
      </section>

      <form className="form admin-form" onSubmit={submitNovel}>
        <h2>{editingNovelId ? "Edit Novel" : "Create Novel"}</h2>
        <label>Title<input required value={novelForm.title} onChange={(e) => setNovelForm({ ...novelForm, title: e.target.value })} /></label>
        <label>Author<input required value={novelForm.author} onChange={(e) => setNovelForm({ ...novelForm, author: e.target.value })} /></label>
        <label>Category<input required value={novelForm.category} onChange={(e) => setNovelForm({ ...novelForm, category: e.target.value })} /></label>
        <label>Short summary<textarea required maxLength="1500" value={novelForm.shortSummary} onChange={(e) => setNovelForm({ ...novelForm, shortSummary: e.target.value })} /></label>
        <label>Full description<textarea value={novelForm.description} onChange={(e) => setNovelForm({ ...novelForm, description: e.target.value })} /></label>
        <label>Tags, separated by commas<input value={novelForm.tags} onChange={(e) => setNovelForm({ ...novelForm, tags: e.target.value })} /></label>
        <label>Story status<select value={novelForm.novelStatus} onChange={(e) => setNovelForm({ ...novelForm, novelStatus: e.target.value })}><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option></select></label>
        <label>Publish status<select value={novelForm.publishStatus} onChange={(e) => setNovelForm({ ...novelForm, publishStatus: e.target.value })}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
        <label>Cover image<input key={fileKey} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} /></label>
        <div className="action-row">
          <button disabled={loading}>{loading ? "Saving..." : editingNovelId ? "Update Novel" : "Create Novel"}</button>
          {editingNovelId && <button className="secondary" type="button" onClick={resetNovelForm}>Cancel edit</button>}
        </div>
      </form>

      <section className="admin-section">
        <div className="toolbar">
          <input placeholder="Search novels" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">All novels</option><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select>
        </div>
        <div className="list">
          {filteredNovels.map((novel) => (
            <div className="admin-card" key={novel._id}>
              <div>
                <h3>{novel.title}</h3>
                <p>{novel.author} · {novel.category} · <b>{novel.publishStatus}</b></p>
              </div>
              <div className="action-row">
                <button type="button" onClick={() => loadChapters(novel)}>Manage chapters</button>
                <button type="button" className="secondary" onClick={() => startNovelEdit(novel)}>Edit</button>
                <button type="button" className="secondary" onClick={() => toggleNovel(novel)}>{novel.publishStatus === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
                <button type="button" className="danger" onClick={() => deleteNovel(novel)}>Delete</button>
              </div>
            </div>
          ))}
          {filteredNovels.length === 0 && <p>No novels found.</p>}
        </div>
      </section>

      {selectedNovel && (
        <section className="admin-section chapter-manager">
          <h2>Chapters: {selectedNovel.title}</h2>
          <form className="form admin-form" onSubmit={submitChapter}>
            <h3>{editingChapterId ? "Edit Chapter" : "Add Chapter"}</h3>
            <label>Chapter number<input required min="1" type="number" value={chapterForm.chapterNumber} onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: e.target.value })} /></label>
            <label>Chapter title<input required value={chapterForm.title} onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })} /></label>
            <label>Telugu chapter content<textarea className="chapter-editor" required value={chapterForm.content} onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })} /></label>
            <label>Publish status<select value={chapterForm.publishStatus} onChange={(e) => setChapterForm({ ...chapterForm, publishStatus: e.target.value })}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
            <div className="action-row">
              <button>{editingChapterId ? "Update Chapter" : "Add Chapter"}</button>
              {editingChapterId && <button type="button" className="secondary" onClick={resetChapterForm}>Cancel edit</button>}
            </div>
          </form>

          <div className="list">
            {chapters.map((chapter) => (
              <div className="admin-card" key={chapter._id}>
                <div>
                  <h3>Chapter {chapter.chapterNumber}: {chapter.title}</h3>
                  <p>{chapter.publishStatus} · {chapter.views || 0} views · {(chapter.likedBy || []).length} likes</p>
                </div>
                <div className="action-row">
                  <button type="button" className="secondary" onClick={() => startChapterEdit(chapter)}>Edit</button>
                  <button type="button" className="secondary" onClick={() => toggleChapter(chapter)}>{chapter.publishStatus === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
                  <button type="button" className="danger" onClick={() => deleteChapter(chapter)}>Delete</button>
                </div>
              </div>
            ))}
            {chapters.length === 0 && <p>No chapters yet. Add your first chapter above.</p>}
          </div>
        </section>
      )}
    </>
  );
}
