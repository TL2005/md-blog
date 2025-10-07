/**
 * 简单的前端路由实现
 */

export const router = {
  routes: {},
  notFoundHandler: null,

  /**
   * 初始化路由
   * @param {Object} routes - 路由配置对象
   */
  init(routes) {
    this.routes = {};
    
    // 注册路由
    Object.keys(routes).forEach(path => {
      if (path === '404') {
        this.notFoundHandler = routes[path];
      } else {
        this.routes[path] = {
          pattern: this._pathToRegex(path),
          handler: routes[path]
        };
      }
    });

    // 初始导航
    this._handleNavigation();

    // 监听 popstate 事件
    window.addEventListener('popstate', () => {
      this._handleNavigation();
    });

    // 拦截链接点击
    document.addEventListener('click', (e) => {
      // 检查是否是链接元素或其子元素
      let target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          this.navigate(href);
        }
      }
    });
  },

  /**
   * 导航到指定路径
   * @param {string} path - 目标路径
   */
  navigate(path) {
    window.history.pushState(null, '', path);
    this._handleNavigation();
  },

  /**
   * 处理当前导航
   */
  _handleNavigation() {
    const path = window.location.pathname;
    let match = false;

    // 尝试匹配路由
    for (const routePath in this.routes) {
      const route = this.routes[routePath];
      const matches = path.match(route.pattern);
      
      if (matches) {
        match = true;
        const params = this._extractParams(routePath, matches);
        route.handler(params);
        break;
      }
    }

    // 如果没有匹配的路由，调用 404 处理程序
    if (!match && this.notFoundHandler) {
      this.notFoundHandler();
    }
  },

  /**
   * 将路径模式转换为正则表达式
   * @param {string} path - 路径模式
   * @returns {RegExp} 对应的正则表达式
   */
  _pathToRegex(path) {
    const pattern = path
      .replace(/\//g, '\\/') // 转义斜杠
      .replace(/:\w+/g, '([^/]+)'); // 将 :param 转换为捕获组
    return new RegExp(`^${pattern}$`);
  },

  /**
   * 从匹配结果中提取参数
   * @param {string} path - 原始路径模式
   * @param {Array} matches - 正则匹配结果
   * @returns {Object} 参数对象
   */
  _extractParams(path, matches) {
    const params = {};
    const paramNames = (path.match(/:\w+/g) || []).map(param => param.substring(1));
    
    paramNames.forEach((name, index) => {
      params[name] = matches[index + 1];
    });
    
    return params;
  }
};