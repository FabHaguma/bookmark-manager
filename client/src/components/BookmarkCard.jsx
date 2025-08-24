const BookmarkCard = ({ bookmark, onEdit, onDelete }) => {
  const defaultFavicon = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>';
  
  return (
    <div className="bookmark-card">
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="card-link">
        <div className="card-header">
          <img 
            src={bookmark.favicon_url || defaultFavicon} 
            alt="favicon" 
            className="favicon"
            onError={(e) => { e.target.onerror = null; e.target.src=defaultFavicon; }}
          />
          <h3 className="card-title">{bookmark.title}</h3>
        </div>
        {bookmark.notes && <p className="card-notes">{bookmark.notes}</p>}
      </a>
      <div className="card-actions">
        <button onClick={() => onEdit(bookmark)} className="action-btn edit-btn">Edit</button>
        <button onClick={() => onDelete(bookmark.id)} className="action-btn delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default BookmarkCard;