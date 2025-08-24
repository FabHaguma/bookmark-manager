import BookmarkCard from './BookmarkCard';

const CategorySection = ({ category, bookmarks, onEdit, onDelete }) => {
  return (
    <section className="category-section">
      <h2 className="category-title">{category || 'Uncategorized'}</h2>
      <div className="bookmarks-grid">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;