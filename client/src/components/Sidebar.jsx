const Sidebar = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li
          onClick={() => onSelectCategory(null)}
          className={!selectedCategory ? 'active' : ''}
        >
          All Bookmarks
        </li>
        {categories.map((category) => (
          <li
            key={category || 'Uncategorized'}
            onClick={() => onSelectCategory(category || 'Uncategorized')}
            className={selectedCategory === (category || 'Uncategorized') ? 'active' : ''}
          >
            {category || 'Uncategorized'}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;