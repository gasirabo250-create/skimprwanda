const slugify = require('slugify');

const makeSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });

module.exports = makeSlug;
