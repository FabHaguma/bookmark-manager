const db = require('../db/database');
const axios = require('axios');
const cheerio = require('cheerio');

// Helper function to fetch metadata from a URL
async function fetchMetadata(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Fetch Title
    const title = $('title').first().text() || $('meta[property="og:title"]').attr('content') || '';

    // Fetch Favicon
    let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
    if (favicon) {
      // Create an absolute URL if the favicon path is relative
      const urlObject = new URL(url);
      favicon = new URL(favicon, urlObject.origin).href;
    } else {
        // Fallback to the root favicon.ico
        favicon = new URL('/favicon.ico', url).href;
    }

    return { title, favicon };
  } catch (error) {
    console.error('Error fetching metadata:', error.message);
    // Return a default title if fetching fails
    return { title: url, favicon: null };
  }
}

// GET /api/bookmarks - List all bookmarks (search and filter enhanced)
exports.getAllBookmarks = (req, res) => {
  const { q, category } = req.query;

  let sql = "SELECT * FROM bookmarks";
  const params = [];

  let conditions = [];
  if (q) {
    conditions.push("(title LIKE ? OR url LIKE ? OR notes LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (category) {
    // Handle the 'Uncategorized' case from the frontend
    if (category === 'Uncategorized') {
      conditions.push("(category IS NULL OR category = '')");
    } else {
      conditions.push("category = ?");
      params.push(category);
    }
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
};

// POST /api/bookmarks - Add new bookmark (Enhanced)
exports.addBookmark = async (req, res) => {
  const { url, category, notes } = req.body;
  if (!url) {
    return res.status(400).json({ "error": "URL is required." });
  }

  const { title, favicon } = await fetchMetadata(url);

  const sql = 'INSERT INTO bookmarks (title, url, category, notes, favicon_url) VALUES (?, ?, ?, ?, ?)';
  const params = [title, url, category || null, notes || null, favicon];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ "error": err.message });
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID, title, url, category, notes, favicon_url: favicon },
    });
  });
};

// PUT /api/bookmarks/:id - Update a bookmark (New)
exports.updateBookmark = (req, res) => {
    const { id } = req.params;
    const { title, url, category, notes } = req.body;

    if (!title || !url) {
        return res.status(400).json({ "error": "Title and URL are required." });
    }

    const sql = `UPDATE bookmarks set 
                    title = ?, 
                    url = ?, 
                    category = ?, 
                    notes = ? 
                 WHERE id = ?`;

    const params = [title, url, category || null, notes || null, id];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": `Bookmark with id ${id} not found.` });
        }
        res.json({
            "message": "success",
            "data": { id, title, url, category, notes },
            "changes": this.changes
        });
    });
};


// DELETE /api/bookmarks/:id - Delete a bookmark (No change)
exports.deleteBookmark = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM bookmarks WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(204).send();
  });
};