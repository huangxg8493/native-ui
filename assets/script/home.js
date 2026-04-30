/**
 * 首页模块
 * 左侧：用户信息、日历、公告
 * 右侧：代办事项 CRUD
 */
(function() {
    var container;
    var editingId = null;  // 当前编辑的待办 ID

    // localStorage key
    var STORAGE_KEY = 'todos';

    // 获取用户信息
    function getUserInfo() {
        var user = localStorage.getItem('user');
        if (!user) return { userName: '未登录', phone: '' };
        try {
            return JSON.parse(user);
        } catch (e) {
            return { userName: '未知', phone: '' };
        }
    }

    // 脱敏手机号
    function maskPhone(phone) {
        if (!phone || phone.length !== 11) return phone || '';
        return phone.substring(0, 3) + '****' + phone.substring(7);
    }

    // 获取用户名首字母
    function getInitial(name) {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    }

    // 获取代办列表
    function getTodos() {
        var data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    // 保存代办列表
    function saveTodos(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    // 生成唯一 Id
    function generateId() {
        return Date.now().toString();
    }

    // HTML 转义
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, function(c) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
        });
    }

    // 渲染用户信息
    function renderUserInfo() {
        var user = getUserInfo();
        var initial = getInitial(user.userName);
        var maskedPhone = maskPhone(user.phone);
        document.getElementById('homeUserAvatar').textContent = initial;
        document.getElementById('homeUserName').textContent = escapeHtml(user.userName || '未知');
        document.getElementById('homeUserPhone').textContent = maskedPhone;
    }

    // 渲染日历
    function renderCalendar() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var today = now.getDate();

        document.getElementById('calendarTitle').textContent = year + '年' + (month + 1) + '月';

        // 获取当月第一天是星期几
        var firstDay = new Date(year, month, 1).getDay();
        // 获取当月总天数
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        // 获取上个月总天数
        var daysInLastMonth = new Date(year, month, 0).getDate();

        var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        var html = weekdays.map(function(d) {
            return '<div class="calendar-weekday">' + d + '</div>';
        }).join('');

        // 上个月的天数
        for (var i = firstDay - 1; i >= 0; i--) {
            html += '<div class="calendar-day other-month">' + (daysInLastMonth - i) + '</div>';
        }

        // 当月的天数
        for (var d = 1; d <= daysInMonth; d++) {
            var isToday = d === today ? ' today' : '';
            html += '<div class="calendar-day' + isToday + '">' + d + '</div>';
        }

        // 下个月的天数（补满 6 行）
        var totalCells = firstDay + daysInMonth;
        var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (var j = 1; j <= remaining; j++) {
            html += '<div class="calendar-day other-month">' + j + '</div>';
        }

        document.getElementById('calendarGrid').innerHTML = html;
    }

    // 渲染公告（静态数据）
    function renderNotice() {
        var notices = [
            '系统将于本周六进行版本更新',
            '新增待办事项功能上线',
            '用户管理模块优化完成',
            '密码安全策略升级公告'
        ];
        var listEl = document.getElementById('noticeList');
        listEl.innerHTML = notices.map(function(n) {
            return '<li class="notice-item">' + escapeHtml(n) + '</li>';
        }).join('');
    }

    // 渲染代办列表
    function renderTodos() {
        var todos = getTodos();
        var listEl = document.getElementById('todoList');

        if (todos.length === 0) {
            listEl.innerHTML = '<div class="todo-empty">暂无待办事项</div>';
            return;
        }

        listEl.innerHTML = todos.map(function(todo) {
            var checkedAttr = todo.completed ? 'checked' : '';
            var completedClass = todo.completed ? ' completed' : '';
            return '<div class="todo-item' + completedClass + '" data-id="' + todo.id + '">' +
                '<input type="checkbox" class="todo-checkbox" ' + checkedAttr + ' data-action="toggle">' +
                '<div class="todo-content">' +
                '<div class="todo-title">' + escapeHtml(todo.title) + '</div>' +
                '<div class="todo-text">' + escapeHtml(todo.content) + '</div>' +
                '</div>' +
                '<div class="todo-actions">' +
                '<button class="todo-edit-btn" data-action="edit">编辑</button>' +
                '<button class="todo-delete-btn" data-action="delete">删除</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    // 绑定事件
    function bindEvents() {
        // 新增按钮
        document.getElementById('todoAddBtn').addEventListener('click', function() {
            editingId = null;
            document.getElementById('modalTitle').textContent = '新增待办';
            document.getElementById('todoTitleInput').value = '';
            document.getElementById('todoContentInput').value = '';
            document.getElementById('todoModal').classList.add('show');
        });

        // 待办列表操作委托
        document.getElementById('todoList').addEventListener('click', function(e) {
            var item = e.target.closest('.todo-item');
            if (!item) return;
            var id = item.dataset.id;
            var action = e.target.dataset.action;

            if (action === 'toggle') {
                var todos = getTodos();
                var todo = todos.find(function(t) { return t.id === id; });
                if (todo) {
                    todo.completed = e.target.checked;
                    saveTodos(todos);
                    renderTodos();
                }
            }

            if (action === 'edit') {
                var todos = getTodos();
                var todo = todos.find(function(t) { return t.id === id; });
                if (todo) {
                    editingId = id;
                    document.getElementById('modalTitle').textContent = '编辑待办';
                    document.getElementById('todoTitleInput').value = todo.title;
                    document.getElementById('todoContentInput').value = todo.content;
                    document.getElementById('todoModal').classList.add('show');
                }
            }

            if (action === 'delete') {
                var todos = getTodos();
                var newTodos = todos.filter(function(t) { return t.id !== id; });
                saveTodos(newTodos);
                renderTodos();
            }
        });

        // 弹窗取消
        document.getElementById('todoCancelBtn').addEventListener('click', function() {
            document.getElementById('todoModal').classList.remove('show');
            editingId = null;
        });

        // 弹窗确认
        document.getElementById('todoSubmitBtn').addEventListener('click', function() {
            var title = document.getElementById('todoTitleInput').value.trim();
            var content = document.getElementById('todoContentInput').value.trim();

            if (!title) {
                alert('请输入标题');
                return;
            }

            var todos = getTodos();

            if (editingId) {
                // 编辑
                var todo = todos.find(function(t) { return t.id === editingId; });
                if (todo) {
                    todo.title = title;
                    todo.content = content;
                }
            } else {
                // 新增
                todos.push({
                    id: generateId(),
                    title: title,
                    content: content,
                    completed: false
                });
            }

            saveTodos(todos);
            document.getElementById('todoModal').classList.remove('show');
            editingId = null;
            renderTodos();
        });

        // 点击遮罩关闭弹窗
        document.getElementById('todoModal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                editingId = null;
            }
        });
    }

    // 渲染整个首页
    function render() {
        container.innerHTML =
            '<link rel="stylesheet" href="../assets/css/home.css">' +
            '<div class="home-container">' +
            '  <div class="home-left">' +
            '    <div class="user-info">' +
            '      <div class="user-avatar" id="homeUserAvatar">?</div>' +
            '      <div class="user-details">' +
            '        <div class="user-name" id="homeUserName">加载中...</div>' +
            '        <div class="user-phone" id="homeUserPhone"></div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="calendar-block">' +
            '      <div class="section-title">日历</div>' +
            '      <div class="calendar-header">' +
            '        <span class="calendar-title" id="calendarTitle"></span>' +
            '      </div>' +
            '      <div class="calendar-grid" id="calendarGrid"></div>' +
            '    </div>' +
            '    <div class="notice-block">' +
            '      <div class="section-title">公告</div>' +
            '      <ul class="notice-list" id="noticeList"></ul>' +
            '    </div>' +
            '  </div>' +
            '  <div class="home-right">' +
            '    <div class="todo-block">' +
            '      <div class="todo-header">' +
            '        <div class="section-title" style="margin-bottom:0;border:none;padding-bottom:0">待办事项</div>' +
            '        <button class="todo-add-btn" id="todoAddBtn">+ 新增</button>' +
            '      </div>' +
            '      <div class="todo-list" id="todoList"></div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="modal-overlay" id="todoModal">' +
            '  <div class="modal-box">' +
            '    <div class="modal-title" id="modalTitle">新增待办</div>' +
            '    <div class="modal-form">' +
            '      <div class="form-group">' +
            '        <label class="form-label">标题</label>' +
            '        <input type="text" class="form-input" id="todoTitleInput" placeholder="请输入待办标题">' +
            '      </div>' +
            '      <div class="form-group">' +
            '        <label class="form-label">内容</label>' +
            '        <textarea class="form-input" id="todoContentInput" placeholder="请输入待办内容"></textarea>' +
            '      </div>' +
            '    </div>' +
            '    <div class="modal-buttons">' +
            '      <button class="btn-cancel" id="todoCancelBtn">取消</button>' +
            '      <button class="btn-primary" id="todoSubmitBtn">确定</button>' +
            '    </div>' +
            '  </div>' +
            '</div>';

        renderUserInfo();
        renderCalendar();
        renderNotice();
        renderTodos();
        bindEvents();
    }

    // 公开接口
    window.HomeModule = {
        init: function(cont) {
            container = cont;
            render();
        },
        refresh: function() {
            render();
        },
        destroy: function() {}
    };
})();
