import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import CategorySection from './components/CategorySection';
import AddBookmarkForm from './components/AddBookmarkForm';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Use useCallback to prevent re-creating the function on every render
  const fetchBookmarks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axios.get('/api/bookmarks', { params });
      setBookmarks(response.data.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }, [searchTerm, selectedCategory]); // Dependencies for useCallback

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]); // fetchBookmarks is now a stable dependency

  const handleSaveBookmark = async (formData, id) => {
    try {
      if (id) {
        await axios.put(`/api/bookmarks/${id}`, formData);
      } else {
        await axios.post('/api/bookmarks', { url: formData.url, category: formData.category, notes: formData.notes });
      }
      fetchBookmarks();
      closeModal();
    } catch (error) {
      console.error("Error saving bookmark:", error);
      alert("Failed to save bookmark.");
    }
  };

  const handleDeleteBookmark = async (id) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await axios.delete(`/api/bookmarks/${id}`);
        fetchBookmarks();
      } catch (error) {
        console.error("Error deleting bookmark:", error);
      }
    }
  };

  const openEditModal = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };
  
  const openAddModal = () => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBookmark(null);
  };

  // This logic now only groups the *filtered* bookmarks for display
  const { groupedBookmarks, categories, uniqueCategories } = useMemo(() => {
    const allCategories = [...new Set(bookmarks.map(b => b.category || 'Uncategorized'))].sort();
    
    const grouped = bookmarks.reduce((acc, bookmark) => {
      const category = bookmark.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(bookmark);
      return acc;
    }, {});
    
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
    });

    return { groupedBookmarks: grouped, categories: sortedCategories, uniqueCategories: allCategories };
  }, [bookmarks]);

  return (
    <div className="app-layout">
      <Sidebar 
        categories={uniqueCategories} 
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <main className="main-content">
        <header>
          <h1>Bookmarks</h1>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <button className="btn-primary" onClick={openAddModal}>Add Bookmark</button>
        </header>

        {bookmarks.length > 0 ? (
            categories.map(category => (
                <CategorySection
                    key={category}
                    category={category}
                    bookmarks={groupedBookmarks[category]}
                    onEdit={openEditModal}
                    onDelete={handleDeleteBookmark}
                />
            ))
        ) : (
            <p className="no-bookmarks">No bookmarks found. Try adjusting your search or filter.</p>
        )}

        {isModalOpen && (
          <AddBookmarkForm
            onSave={handleSaveBookmark}
            editingBookmark={editingBookmark}
            onClose={closeModal}
          />
        )}
      </main>
    </div>
  );
}

export default App;