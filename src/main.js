import { marked } from 'marked';
import hljs from 'highlight.js';
import { fetchMarkdownContent } from './utils/markdown-loader.js';
import { router } from './utils/router.js';

// 配置marked，使用highlight.js进行代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// 计算阅读时间
function calculateReadingTime(text) {
  const wordsPerMinute = 200; // 平均阅读速度
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime < 1 ? 1 : readingTime;
}

// 初始化应用
async function initApp() {
  const contentElement = document.getElementById('content');
  
  // 加载分类和标签
  await loadCategoriesAndTags();
  
  // 路由处理
  router.init({
    '/': async () => {
      contentElement.innerHTML = await loadHomePage();
    },
    '/post/:slug': async (params) => {
      contentElement.innerHTML = await loadPost(params.slug);
    },
    '/archives': async () => {
      contentElement.innerHTML = await loadArchives();
    },
    '/categories': async () => {
      contentElement.innerHTML = await loadCategories();
    },
    '/tags': async () => {
      contentElement.innerHTML = await loadTags();
    },
    '/about': async () => {
      contentElement.innerHTML = await loadAboutPage();
    },
    '404': () => {
      contentElement.innerHTML = '<div class="error-page"><h2>404 - 页面未找到</h2><p>抱歉，您请求的页面不存在。</p></div>';
    }
  });
}

// 加载分类和标签
async function loadCategoriesAndTags() {
  try {
    // 加载分类
    const categoriesData = await fetchMarkdownContent('categories-list');
    const categoriesElement = document.getElementById('categories-list');
    if (categoriesElement) {
      categoriesElement.innerHTML = marked.parse(categoriesData);
    }
    
    // 加载标签
    const tagsData = await fetchMarkdownContent('tags-list');
    const tagsElement = document.getElementById('tags-cloud');
    if (tagsElement) {
      tagsElement.innerHTML = marked.parse(tagsData);
    }
  } catch (error) {
    console.error('加载分类和标签失败:', error);
  }
}

// 加载首页
async function loadHomePage() {
  try {
    const posts = await fetchMarkdownContent('index');
    const postsList = await fetchMarkdownContent('posts-list');
    
    // 解析文章列表，添加置顶标记和阅读时间
    const parsedPostsList = postsList
      .replace(/\[(.+?)\]\(\/post\/(.+?)\) - (\d{4}-\d{2}-\d{2})/g, (match, title, slug, date) => {
        const isPinned = match.includes('置顶');
        const pinnedClass = isPinned ? 'pinned-post' : '';
        
        return `
          <div class="post-card ${pinnedClass}">
            <h2 class="post-title"><a href="/post/${slug}">${title}</a></h2>
            <div class="post-meta">
              <span><i class="far fa-calendar-alt"></i> ${date}</span>
              <span class="reading-time"><i class="far fa-clock"></i> 预计阅读时间：${calculateReadingTime(title)} 分钟</span>
            </div>
            <div class="post-excerpt">
              这是文章的摘要内容，点击标题查看完整文章...
            </div>
            <a href="/post/${slug}" class="read-more">阅读全文 <i class="fas fa-angle-right"></i></a>
          </div>
        `;
      });
    
    return `
      <div class="home-page">
        <section class="intro">
          ${marked.parse(posts)}
        </section>
        <section class="recent-posts">
          <h2>最新文章</h2>
          <div class="post-list">
            ${parsedPostsList}
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    console.error('加载首页失败:', error);
    return '<div class="error">加载内容失败</div>';
  }
}

// 加载文章页面
async function loadPost(slug) {
  try {
    const postContent = await fetchMarkdownContent(`posts/${slug}`);
    
    // 提取标题和日期
    const titleMatch = postContent.match(/^# (.+)/);
    const dateMatch = postContent.match(/\*发布于: (\d{4}-\d{2}-\d{2})\*/);
    
    const title = titleMatch ? titleMatch[1] : '无标题';
    const date = dateMatch ? dateMatch[1] : '未知日期';
    
    // 计算阅读时间
    const readingTime = calculateReadingTime(postContent);
    
    // 移除标题和日期行，因为我们会单独显示它们
    const contentWithoutMeta = postContent
      .replace(/^# .+\n/, '')
      .replace(/\*发布于: \d{4}-\d{2}-\d{2}\*\n/, '');
    
    return `
      <article class="post">
        <h1 class="post-title">${title}</h1>
        <div class="post-meta">
          <span><i class="far fa-calendar-alt"></i> ${date}</span>
          <span class="reading-time"><i class="far fa-clock"></i> 阅读时间：${readingTime} 分钟</span>
          <span class="category"><i class="fas fa-folder"></i> <a href="/categories">技术</a></span>
          <span class="tags">
            <i class="fas fa-tags"></i>
            <a href="/tags" class="tag">Markdown</a>
            <a href="/tags" class="tag">博客</a>
          </span>
        </div>
        <div class="post-content">
          ${marked.parse(contentWithoutMeta)}
        </div>
      </article>
    `;
  } catch (error) {
    console.error(`加载文章 ${slug} 失败:`, error);
    return '<div class="error">文章加载失败</div>';
  }
}

// 加载归档页面
async function loadArchives() {
  try {
    const archiveContent = await fetchMarkdownContent('archives');
    return `
      <div class="archives">
        <h1>文章归档</h1>
        ${marked.parse(archiveContent)}
      </div>
    `;
  } catch (error) {
    console.error('加载归档页面失败:', error);
    return '<div class="error">加载归档失败</div>';
  }
}

// 加载分类页面
async function loadCategories() {
  try {
    const categoriesContent = await fetchMarkdownContent('categories');
    return `
      <div class="categories-page">
        <h1>文章分类</h1>
        ${marked.parse(categoriesContent)}
      </div>
    `;
  } catch (error) {
    console.error('加载分类页面失败:', error);
    return '<div class="error">加载分类失败</div>';
  }
}

// 加载标签页面
async function loadTags() {
  try {
    const tagsContent = await fetchMarkdownContent('tags');
    return `
      <div class="tags-page">
        <h1>标签云</h1>
        ${marked.parse(tagsContent)}
      </div>
    `;
  } catch (error) {
    console.error('加载标签页面失败:', error);
    return '<div class="error">加载标签失败</div>';
  }
}

// 加载关于页面
async function loadAboutPage() {
  try {
    const aboutContent = await fetchMarkdownContent('about');
    return `
      <div class="about">
        ${marked.parse(aboutContent)}
      </div>
    `;
  } catch (error) {
    console.error('加载关于页面失败:', error);
    return '<div class="error">加载关于页面失败</div>';
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  // 移动端抽屉菜单功能
  setupMobileDrawer();
});

// 设置移动端抽屉菜单
function setupMobileDrawer() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeDrawer = document.querySelector('.close-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  
  if (menuToggle && drawer && closeDrawer && overlay) {
    // 打开抽屉菜单
    menuToggle.addEventListener('click', () => {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
    
    // 关闭抽屉菜单
    function closeDrawerMenu() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = ''; // 恢复背景滚动
    }
    
    closeDrawer.addEventListener('click', closeDrawerMenu);
    overlay.addEventListener('click', closeDrawerMenu);
    
    // 抽屉菜单内的链接点击后关闭抽屉
    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawerMenu);
    });
  }
}