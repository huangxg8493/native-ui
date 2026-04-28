/**
 * TabManager - SPA Tab 切换管理器
 * 管理 Tab 的打开、关闭、激活，以及 Tab 栏和内容的渲染
 */
(function() {
    window.TabManager = {
        tabs: [],        // { id, title, renderFn }
        activeId: null,

        // 注册一个 Tab（但不打开）
        register: function(id, title, renderFn) {
            // 已在 tabs 中则不重复注册
            if (this.tabs.some(function(t) { return t.id === id; })) return;
            this.tabs.push({ id: id, title: title, renderFn: renderFn });
        },

        // 打开/激活 Tab
        open: function(id) {
            var tab = this.tabs.find(function(t) { return t.id === id; });
            if (!tab) return;
            this.activeId = id;
            this.render();
            tab.renderFn();
        },

        // 关闭 Tab
        close: function(id) {
            var idx = this.tabs.findIndex(function(t) { return t.id === id; });
            if (idx === -1) return;
            this.tabs.splice(idx, 1);
            if (this.activeId === id) {
                // 激活最近一个 Tab 或回到欢迎页
                if (this.tabs.length > 0) {
                    var lastTab = this.tabs[this.tabs.length - 1];
                    this.activeId = lastTab.id;
                    this.render();
                    lastTab.renderFn();
                } else {
                    this.activeId = null;
                    this.render();
                    this.showWelcome();
                }
            } else {
                this.render();
            }
        },

        // 渲染 Tab 栏
        render: function() {
            var container = document.getElementById('tabBar');
            if (!container) return;
            var html = '';
            this.tabs.forEach(function(tab) {
                var active = tab.id === TabManager.activeId ? 'active' : '';
                html += '<div class="tab-item ' + active + '" data-id="' + tab.id + '">' +
                    '<span class="tab-title">' + tab.title + '</span>' +
                    '<span class="tab-close" data-id="' + tab.id + '">×</span>' +
                    '</div>';
            });
            container.innerHTML = html;

            // 内容区显示/隐藏
            var contentArea = document.getElementById('tabContent');
            if (contentArea) {
                contentArea.style.display = this.tabs.length > 0 ? 'block' : 'none';
            }
        },

        // 显示欢迎页
        showWelcome: function() {
            var contentArea = document.getElementById('tabContent');
            if (contentArea) contentArea.innerHTML = '';
            var welcome = document.getElementById('welcomeContent');
            if (welcome) welcome.style.display = 'flex';
        }
    };
})();