import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { pageTransition } from "../animations";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = () => {
    setError("");
    api
      .get("/notes")
      .then((res) => setNotes(res.data))
      .catch(() => setError("Could not load notes."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchNotes, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, { title, content });
      } else {
        await api.post("/notes", { title, content });
      }
      setTitle("");
      setContent("");
      setEditingId(null);
      fetchNotes();
    } catch {
      setError("Could not save note.");
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch {
      setError("Could not delete note.");
    }
  };

  return (
    <motion.div {...pageTransition} className="flex-1 p-6 space-y-8">
      <h2 className="text-3xl font-bold gradient-text">Your Notes</h2>
      {error && <p className="glass-card p-4 text-red-300">{error}</p>}

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-4"
      >
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-neon-blue transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-neon-blue transition-colors resize-none"
            required
          />
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full font-semibold"
          >
            {editingId ? "Update" : "Save"} Note
          </motion.button>
          {editingId && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
                setEditingId(null);
              }}
              className="px-6 py-2 bg-white/10 rounded-full"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </motion.form>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="glass-card p-5">
                <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <p className="text-gray-400">
            No notes saved yet. Create your first one!
          </p>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-5 group"
            >
              <h3 className="text-xl font-semibold text-neon-blue mb-2">
                {note.title}
              </h3>
              <p className="text-white/70 whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-3 py-1 text-sm bg-neon-blue/20 text-neon-blue rounded-full hover:bg-neon-blue/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
