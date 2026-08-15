const asyncHandler = require('../utils/asyncHandler');
const Article = require('../models/Article');
const makeSlug = require('../utils/slugify');

const getArticles = asyncHandler(async (req, res) => {
  const query = req.admin ? {} : { published: true };
  if (req.query.category) query.category = req.query.category;
  const articles = await Article.find(query).sort('-createdAt');
  res.json({ success: true, data: articles });
});

const getArticleBySlug = asyncHandler(async (req, res) => {
  const query = { slug: req.params.slug };
  if (!req.admin) query.published = true;
  const article = await Article.findOne(query);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  res.json({ success: true, data: article });
});

const createArticle = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
  const baseSlug = makeSlug(title);
  let slug = baseSlug;
  let counter = 1;
  while (await Article.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const article = await Article.create({ ...req.body, slug });
  res.status(201).json({ success: true, data: article });
});

const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  Object.assign(article, req.body);
  await article.save();
  res.json({ success: true, data: article });
});

const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  await article.deleteOne();
  res.json({ success: true, message: 'Article deleted' });
});

module.exports = { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle };
