-- 🌸 花屿 - 数据库初始化脚本
-- 运行方式：在 Supabase 控制台 SQL Editor 中执行

-- 1. 文章表
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,                      -- 摘要
  cover_image TEXT,                  -- 封面图
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 标签表
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- 3. 文章-标签 关联表
CREATE TABLE article_tags (
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 4. 友链表
CREATE TABLE friends (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  avatar TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. 站点配置表
CREATE TABLE site_config (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 默认站点配置
INSERT INTO site_config (key, value) VALUES
  ('site_name', '花屿'),
  ('site_description', '个人知识花园，记录思考与成长'),
  ('site_avatar', ''),
  ('site_keywords', '花屿,个人博客,知识花园');

-- 索引
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_tags_slug ON tags(slug);

-- 文章全文搜索（英文+中文）
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))) STORED;

CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);
