-- 🌸 花屿 - RLS 安全策略
-- 在 Supabase SQL Editor 执行
-- 注意：需要先在 Auth → Providers 中开启 Email 登录

-- 启用行级安全
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- ===== 文章策略 =====
-- 所有人可读已发布的文章
CREATE POLICY "公开已发布文章" ON articles
  FOR SELECT USING (status = 'published');

-- 登录用户可增删改所有文章
CREATE POLICY "登录用户可管理文章" ON articles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== 标签策略 =====
CREATE POLICY "公开读标签" ON tags
  FOR SELECT USING (true);

CREATE POLICY "登录用户管理标签" ON tags
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== 文章-标签关联策略 =====
CREATE POLICY "公开读关联" ON article_tags
  FOR SELECT USING (true);

CREATE POLICY "登录用户管理关联" ON article_tags
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== 友链策略 =====
CREATE POLICY "公开读友链" ON friends
  FOR SELECT USING (true);

CREATE POLICY "登录用户管理友链" ON friends
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===== 站点配置策略 =====
CREATE POLICY "公开读配置" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "登录用户管理配置" ON site_config
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
