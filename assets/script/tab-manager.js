/**
 * TabManager - SPA Tab 切换管理器
 * 管理 Tab 的打开、关闭、激活，以及 Tab 栏和内容的渲染
 */
(function() {
    window.TabManager = {
        tabs: [],           // 渲染池：真正渲染到 Tab 栏
        pendingTabs: [],    // 预注册池：已注册但未渲染
        activeId: null,

        // 注册一个 Tab 到渲染池
        register: function(id, title, renderFn, closable) {
            if (this.tabs.some(function(t) { return t.id === id; })) return;
            this.tabs.push({ id: id, title: title, renderFn: renderFn, closable: closable !== undefined ? closable : true });
        },

        // 注册一个 Tab 到预注册池（不渲染）
        registerPending: function(id, title, renderFn, closable) {
            if (this.tabs.some(function(t) { return t.id === id; })) return;
            if (this.pendingTabs.some(function(t) { return t.id === id; })) return;
            this.pendingTabs.push({ id: id, title: title, renderFn: renderFn, closable: closable !== undefined ? closable : true });
        },

        // 将预注册池中的 Tab 激活（转入渲染池）
        activatePending: function(id) {
            var idx = this.pendingTabs.findIndex(function(t) { return t.id === id; });
            if (idx === -1) return false;
            var tab = this.pendingTabs.splice(idx, 1)[0];
            this.tabs.push(tab);
            return true;
        },

        // 打开/激活 Tab
        open: function(id) {
            console.log('[DEBUG] TabManager.open called, id:', id);
            var tab = this.tabs.find(function(t) { return t.id === id; });
            // 如果在渲染池中找不到，自动从预注册池激活
            if (!tab) {
                console.log('[DEBUG] Tab not found in tabs, checking pendingTabs');
                this.activatePending(id);
                tab = this.tabs.find(function(t) { return t.id === id; });
            }
            if (!tab) {
                console.log('[DEBUG] Tab not found after activate, tabs:', this.tabs.map(t => t.id), 'pending:', this.pendingTabs.map(t => t.id));
                return;
            }
            this.activeId = id;

            // 隐藏欢迎页
            var welcome = document.getElementById('welcomeContent');
            if (welcome) welcome.style.display = 'none';

            this.render();
            tab.renderFn();
        },

        // 关闭 Tab
        close: function(id) {
            var tab = this.tabs.find(function(t) { return t.id === id; });
            if (!tab) return;
            if (tab.closable === false) return;  // 不可关闭
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
                var closeBtn = tab.closable !== false ? '<span class="tab-close" data-id="' + tab.id + '">×</span>' : '';
                html += '<div class="tab-item ' + active + '" data-id="' + tab.id + '">' +
                    '<span class="tab-title">' + tab.title + '</span>' +
                    closeBtn +
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