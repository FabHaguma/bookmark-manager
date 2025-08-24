import { useState, useEffect } from 'react';

const AddBookmarkForm = ({ onSave, editingBookmark, onClose }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    category: '',
    notes: '',
  });

  const isEditing = !!editingBookmark;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        url: editingBookmark.url,
        title: editingBookmark.title,
        category: editingBookmark.category || '',
        notes: editingBookmark.notes || '',
      });
    } else {
      setFormData({ url: '', title: '', category: '', notes: '' });
    }
  }, [editingBookmark]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditing ? editingBookmark.id : null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit Bookmark' : 'Add New Bookmark'}</h2>
        <form onSubmit={handleSubmit}>
          {!isEditing && (
             <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                />
            </div>
          )}
          {isEditing && (
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="category">Category (optional)</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkForm;