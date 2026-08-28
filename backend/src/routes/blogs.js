const express = require('express');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapBlog(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    author: row.author,
    authorRole: row.author_role,
    date: row.date,
    readTime: row.read_time,
    coverImage: row.cover_image,
    images: row.images || [],
    excerpt: row.excerpt,
    content: row.content,
  };
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .flatMap((item) => {
      const str = String(item).trim();
      const matches = str.match(/https?:\/\/[^\s,]+/gi);
      return matches ? matches.map((u) => u.trim()) : [str];
    })
    .filter(Boolean);
}

// GET /api/blogs
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, count: data.length, data: data.map(mapBlog) });
});

// GET /api/blogs/:id  (id can be a UUID or a slug)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  let query = supabase.from('blogs').select('*');
  query = UUID_RE.test(id) ? query.or(`id.eq.${id},slug.eq.${id}`) : query.eq('slug', id);

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return res.status(404).json({ success: false, error: 'Blog post not found' });
  }
  res.json({ success: true, data: mapBlog(data) });
});

// POST /api/blogs
router.post('/', async (req, res) => {
  const { title, content, category, author, authorRole, excerpt, coverImage, images, date, eventDate } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, error: 'Title and content are required fields.' });
  }

  const wordCount = content.trim().split(/\s+/).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

  const row = {
    title: title.trim(),
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    category: category ? category.trim() : 'General',
    author: author ? author.trim() : 'The Jobsync Team',
    author_role: authorRole || 'IT Consultant',
    date: date || eventDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    read_time: estimatedReadTime,
    cover_image: coverImage ? coverImage.trim() : '',
    images: normalizeImages(images),
    excerpt: excerpt || content.slice(0, 140) + '...',
    content,
  };

  const { data, error } = await supabase.from('blogs').insert(row).select().single();
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.status(201).json({ success: true, message: 'Blog post created successfully!', data: mapBlog(data) });
});

// PUT /api/blogs/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category, author, authorRole, excerpt, coverImage, images, date, eventDate } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, error: 'Title and content are required fields.' });
  }

  const wordCount = content.trim().split(/\s+/).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

  const row = {
    title: title.trim(),
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    category: category ? category.trim() : 'General',
    author: author ? author.trim() : 'The Jobsync Team',
    author_role: authorRole || 'IT Consultant',
    date: date || eventDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    read_time: estimatedReadTime,
    cover_image: coverImage !== undefined ? coverImage.trim() : '',
    images: normalizeImages(images),
    excerpt: excerpt ? excerpt.trim() : content.slice(0, 140) + '...',
    content: content.trim(),
  };

  const { data, error } = await supabase.from('blogs').update(row).eq('id', id).select().maybeSingle();
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  if (!data) {
    return res.status(404).json({ success: false, error: 'Blog post not found' });
  }
  res.json({ success: true, message: 'Blog post updated successfully!', data: mapBlog(data) });
});

// DELETE /api/blogs/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('blogs').delete().eq('id', req.params.id);
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, message: 'Blog post deleted successfully' });
});

module.exports = router;
