# 设计规范模板

> UI/UX 工程师输出设计规范，统一视觉语言。

---

## 1. 色彩系统

```css
:root {
  /* 主色 */
  --color-primary: #xxx;
  --color-primary-light: #xxx;
  --color-primary-dark: #xxx;

  /* 辅色 */
  --color-secondary: #xxx;
  --color-accent: #xxx;

  /* 中性色 */
  --color-bg: #xxx;
  --color-surface: #xxx;
  --color-border: #xxx;

  /* 文字色 */
  --color-text-primary: #xxx;
  --color-text-secondary: #xxx;
  --color-text-muted: #xxx;

  /* 功能色 */
  --color-success: #xxx;
  --color-warning: #xxx;
  --color-error: #xxx;
}
```

## 2. 字体系统

| 用途 | 字体 | 字重 | 大小 |
|------|------|:----:|:----:|
| 标题 | Font Name | 600/700 | 24-36px |
| 正文 | Font Name | 400 | 16px |
| 小字 | Font Name | 400 | 12-14px |

## 3. 间距系统

- 基准：4px / 8px 网格
- 内边距：`4 8 12 16 20 24 32 48 64`
- 外边距：同上

## 4. 圆角

| 级别 | 大小 | 用途 |
|:----:|:----:|------|
| sm | 4px | 标签、小图标 |
| md | 8px | 按钮、输入框 |
| lg | 12px | 卡片、弹窗 |
| xl | 16px | 大卡片、页面容器 |
| full | 9999px | 标签、头像 |

## 5. 阴影

| 级别 | 值 | 用途 |
|:----:|:---|------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | 小元素 |
| md | `0 4px 6px rgba(0,0,0,0.07)` | 卡片 |
| lg | `0 10px 15px rgba(0,0,0,0.1)` | 弹窗/下拉 |

## 6. 动效

- 过渡时长：`0.2s` 基础，`0.3s` 卡片
- 缓动函数：`cubic-bezier(0.4, 0, 0.2, 1)`
- 悬停效果：上浮 `translateY(-2px)` + 阴影加深

## 7. 图标风格

- 图标库：[Font Awesome / Lucide / Heroicons]
- 风格：线性/面性
- 大小：`16px` 内联，`20px` 导航，`24px+` 大图标

## 8. 组件规范

### 按钮
```
正常态：背景色 + 文字
悬停态：加深
禁用态：50% 透明度
加载态：旋转图标
```

### 卡片
```
背景：白色
圆角：12px
边框：1px solid 边框色
阴影：sm/md
内边距：20-24px
空状态：居中图标 + 文字提示
```

### 输入框
```
圆角：8px
边框：1px solid
聚焦：2px ring
错误：红色边框 + 提示文字
```

### 导航栏
```
固定顶部
毛玻璃背景（backdrop-blur）
半透明底边线
激活项：品牌色高亮
```
