/**
 * 用户管理模块
 * 暴露 init(container), refresh(), destroy()
 */
(function() {
    var currentPage = 1;
    var currentPageSize = 10;
    var currentUserId;     // 当前编辑/分配角色的用户ID
    var container;         // 模块容器

    // Toast 提示
    function showToast(message, type) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'toast ' + (type || 'info');
        toast.style.display = 'block';
        setTimeout(function() { toast.style.display = 'none'; }, 2000);
    }

    // HTML 转义，防止 XSS
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, function(c) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
        });
    }

    // HTTP 请求封装
    function request(url, method, body) {
        var token = localStorage.getItem('token');
        if (!token) {
            showToast('请先登录', 'error');
            return Promise.reject('No token');
        }
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        if (body) options.body = JSON.stringify(body);
        return fetch(url, options)
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .catch(function(err) {
                showToast('网络错误', 'error');
                throw err;
            });
    }

    // 格式化时间 YYYY-MM-DD HH:mm
    function formatTime(timeStr) {
        if (!timeStr) return '-';
        var d = new Date(timeStr);
        var pad = function(n) { return n < 10 ? '0' + n : n; };
        return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' +
            pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    // 绑定事件
    function bindEvents() {
        // 查询
        document.getElementById('queryBtn').addEventListener('click', queryUsers);

        // 新增
        document.getElementById('addBtn').addEventListener('click', function() {
            currentUserId = null;
            document.getElementById('modalTitle').textContent = '新增用户';
            document.getElementById('formUserId').value = '';
            document.getElementById('formPhone').value = '';
            document.getElementById('formPhone').readOnly = false;
            document.getElementById('formPassword').value = '';
            document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码';
            document.getElementById('formUserName').value = '';
            document.getElementById('formEmail').value = '';
            document.getElementById('formCity').value = '';
            document.getElementById('formStatus').value = 'Y';
            document.getElementById('formCreateTime').value = '-';
            document.getElementById('formUpdateTime').value = '-';
            document.getElementById('userModal').style.display = 'flex';
        });

        // 表格内操作（编辑/删除/分配角色）委托
        document.getElementById('userTableBody').addEventListener('click', function(e) {
            var target = e.target;
            var userId = target.dataset.userid;
            if (!userId) return;

            if (target.classList.contains('editBtn')) {
                // 编辑
                currentUserId = parseInt(userId);
                document.getElementById('modalTitle').textContent = '编辑用户';
                document.getElementById('formUserId').value = userId;
                var row = target.closest('tr');
                var cells = row.cells;
                // 序号=0, 手机号=1, 用户名=2, 邮箱=3, 省市区=4, 状态=5, 创建时间=6, 更新时间=7, 操作=8
                document.getElementById('formPhone').value = cells[1].textContent.trim();
                document.getElementById('formPhone').readOnly = true;
                document.getElementById('formPassword').value = '';
                document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码（不填则不修改）';
                document.getElementById('formUserName').value = cells[2].textContent.trim();
                document.getElementById('formEmail').value = cells[3].textContent.trim();
                document.getElementById('formCity').value = cells[4].textContent.trim();
                var statusCell = cells[5].textContent.trim();
                document.getElementById('formStatus').value = statusCell === '正常' ? 'Y' : 'N';
                document.getElementById('formCreateTime').value = cells[6].textContent.trim();
                document.getElementById('formUpdateTime').value = cells[7].textContent.trim();
                document.getElementById('userModal').style.display = 'flex';
            }

            if (target.classList.contains('deleteBtn')) {
                if (!confirm('确定删除该用户？')) return;
                request('/api/users/delete?userId=' + userId, 'POST').then(function(res) {
                    if (res.code === '000000') {
                        showToast('删除成功', 'success');
                        queryUsers();
                    } else {
                        showToast(res.message || '删除失败', 'error');
                    }
                });
            }

            if (target.classList.contains('roleBtn')) {
                currentUserId = parseInt(userId);
                var phone = target.dataset.phone;
                document.getElementById('roleModalTitle').textContent = '为 ' + phone + ' 分配角色';
                var roles = JSON.parse(localStorage.getItem('roles') || '[]');
                var roleListEl = document.getElementById('roleList');
                roleListEl.innerHTML = roles.map(function(r) {
                    return '<div class="role-item"><input type="checkbox" value="' + r.roleId + '" id="role_' + r.roleId + '"><label for="role_' + r.roleId + '">' + r.roleName + '</label></div>';
                }).join('');
                document.getElementById('roleModal').style.display = 'flex';
            }
        });

        // 表单提交（新增/编辑）
        document.getElementById('userForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var userId = document.getElementById('formUserId').value;
            var phone = document.getElementById('formPhone').value.trim();
            var password = document.getElementById('formPassword').value;
            var status = document.getElementById('formStatus').value;

            if (!phone || !/^1\d{10}$/.test(phone)) {
                showToast('请输入正确的手机号', 'error');
                return;
            }

            var payload = {
                phone: phone,
                status: status,
                userName: document.getElementById('formUserName').value.trim(),
                email: document.getElementById('formEmail').value.trim(),
                city: document.getElementById('formCity').value.trim()
            };
            if (userId) {
                payload.userId = parseInt(userId);
                if (password) payload.password = password;
                request('/api/users/update', 'POST', payload).then(function(res) {
                    if (res.code === '000000') {
                        showToast('更新成功', 'success');
                        document.getElementById('userModal').style.display = 'none';
                        queryUsers();
                    } else {
                        showToast(res.message || '更新失败', 'error');
                    }
                });
            } else {
                if (!password || password.length < 6) {
                    showToast('密码最少6位', 'error');
                    return;
                }
                payload.password = password;
                request('/api/users/create', 'POST', payload).then(function(res) {
                    if (res.code === '000000') {
                        showToast('新增成功', 'success');
                        document.getElementById('userModal').style.display = 'none';
                        queryUsers();
                    } else {
                        showToast(res.message || '新增失败', 'error');
                    }
                });
            }
        });

        // 取消弹窗
        document.getElementById('cancelBtn').addEventListener('click', function() {
            document.getElementById('userModal').style.display = 'none';
        });

        // 分配角色确认
        document.getElementById('roleConfirmBtn').addEventListener('click', function() {
            var checked = document.querySelectorAll('#roleList input:checked');
            var roleIds = Array.from(checked).map(function(cb) { return parseInt(cb.value); });
            request('/api/users/' + currentUserId + '/roles/assign', 'POST', roleIds).then(function(res) {
                if (res.code === '000000') {
                    showToast('分配成功', 'success');
                    document.getElementById('roleModal').style.display = 'none';
                } else {
                    showToast(res.message || '分配失败', 'error');
                }
            });
        });

        document.getElementById('roleCancelBtn').addEventListener('click', function() {
            document.getElementById('roleModal').style.display = 'none';
        });

        // 分页
        document.getElementById('pageSizeSelect').addEventListener('change', function() {
            currentPageSize = parseInt(this.value);
            queryUsers();
        });

        document.getElementById('prevBtn').addEventListener('click', function() {
            if (currentPage > 1) { currentPage--; queryUsers(); }
        });

        document.getElementById('nextBtn').addEventListener('click', function() {
            currentPage++;
            queryUsers();
        });

        // 弹窗背景点击关闭
        ['userModal', 'roleModal'].forEach(function(id) {
            document.getElementById(id).addEventListener('click', function(e) {
                if (e.target === this) this.style.display = 'none';
            });
        });
    }

    // 渲染表格
    function renderTable(data) {
        var tbody = document.getElementById('userTableBody');
        if (!tbody) return;
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999">暂无数据</td></tr>';
            return;
        }
        var start = (currentPage - 1) * currentPageSize + 1;
        var html = '';
        data.forEach(function(user, i) {
            var provinceCity = user.city || '-';
            var statusHtml = user.status === 'Y'
                ? '<span style="color:#52c41a;font-weight:bold">正常</span>'
                : '<span style="color:#ff4d4f;font-weight:bold">禁用</span>';
            html += '<tr>' +
                '<td>' + (start + i) + '</td>' +
                '<td>' + escapeHtml(user.phone) + '</td>' +
                '<td>' + escapeHtml(user.userName || '-') + '</td>' +
                '<td>' + escapeHtml(user.email || '-') + '</td>' +
                '<td>' + escapeHtml(provinceCity) + '</td>' +
                '<td>' + statusHtml + '</td>' +
                '<td>' + formatTime(user.createTime) + '</td>' +
                '<td>' + formatTime(user.updateTime) + '</td>' +
                '<td>' +
                    '<button class="editBtn btn" data-userid="' + user.userId + '">编辑</button>' +
                    '<button class="deleteBtn btn" style="background-color:#ff4d4f" data-userid="' + user.userId + '">删除</button>' +
                    '<button class="roleBtn btn" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">分配角色</button>' +
                '</td>' +
                '</tr>';
        });
        tbody.innerHTML = html;
    }

    // 渲染分页信息
    function renderPagination(total) {
        var totalPages = Math.max(1, Math.ceil(total / currentPageSize));
        var pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            pageInfo.textContent = '共 ' + total + ' 条，第 ' + currentPage + '/' + totalPages + ' 页';
        }
        if (document.getElementById('prevBtn')) {
            document.getElementById('prevBtn').disabled = currentPage <= 1;
        }
        if (document.getElementById('nextBtn')) {
            document.getElementById('nextBtn').disabled = currentPage >= totalPages;
        }
    }

    // 查询列表
    function queryUsers() {
        var phone = document.getElementById('searchPhone').value.trim();
        var status = document.getElementById('searchStatus').value;
        var params = { pageNum: currentPage, pageSize: currentPageSize };
        if (phone) params.phone = phone;
        if (status) params.status = status;

        request('/api/users/query', 'POST', params).then(function(res) {
            if (res.code === '000000') {
                var data = res.data || [];
                renderTable(data);
                // 假设 total 为 data 长度（实际需要后端返回 total）
                renderPagination(data.length > 0 ? data.length * currentPage : 0);
            } else {
                showToast(res.message || '查询失败', 'error');
            }
        });
    }

    // 公开接口
    window.UserModule = {
        init: function(cont) {
            container = cont;
            bindEvents();
            queryUsers();
        },
        refresh: function() {
            queryUsers();
        },
        destroy: function() {
            // 清理
        }
    };
})();
