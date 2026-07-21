/* ============================================================
   CadreCard · 干部卡片 JS 组件
   使用: CadreCard.render(container, data, onClick)
   ============================================================ */

var CadreCard = (function() {
  'use strict';

  /**
   * 渲染单个干部卡片
   * @param {Object} d - 干部数据
   *   { id, name, title, org, phone, avatar, color, photo, qr,
   *     monthTasks, monthDone, satisfaction }
   * @param {Function} onClick - 点击回调
   * @returns {HTMLElement}
   */
  function render(d, onClick) {
    var card = document.createElement('div');
    card.className = 'cadre-card';

    var doneRate = d.monthTasks > 0 ? Math.round(d.monthDone / d.monthTasks * 100) : 100;

    // 头像：有照片用 <img>，否则用占位
    var avatarHtml = d.photo
      ? '<img src="' + d.photo + '" class="avatar" style="box-shadow:0 0 20px ' + (d.color || 'var(--pri-glow)') + ';border-color:' + (d.color || 'var(--pri)') + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
      : '';
    var fallbackHtml = '<div class="avatar-placeholder" style="background:linear-gradient(135deg,' + (d.color || 'var(--pri)') + ',transparent);' + (d.photo ? 'display:none' : '') + '">' + (d.avatar || d.name[0]) + '</div>';

    card.innerHTML =
      avatarHtml + fallbackHtml +
      '<div class="name">' + d.name + '</div>' +
      '<div class="role" style="color:' + (d.color || 'var(--pri)') + '">' + d.title + '</div>' +
      '<div class="org">' + (d.org || '') + '</div>' +
      (d.phone ? '<div class="phone">📱 ' + d.phone + '</div>' : '') +
      '<div class="qr-entry" onclick="event.stopPropagation();CadreCard.showQR(\'' + d.name + '\')">💚 微信二维码</div>' +
      '<div class="stats">' +
        '<div class="stat-item"><div class="stat-val">' + d.monthTasks + '</div><div class="stat-lbl">本月事项</div></div>' +
        '<div class="stat-divider"></div>' +
        '<div class="stat-item"><div class="stat-val green">' + doneRate + '%</div><div class="stat-lbl">完成率</div></div>' +
        '<div class="stat-divider"></div>' +
        '<div class="stat-item"><div class="stat-val amber">' + d.satisfaction + '%</div><div class="stat-lbl">满意度</div></div>' +
      '</div>';

    if (onClick) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function() { onClick(d); });
    }

    // Hover effects
    card.addEventListener('mouseenter', function() {
      this.style.borderColor = d.color || 'var(--pri)';
      this.style.boxShadow = 'var(--shadow-lg), 0 0 20px ' + (d.color || 'var(--pri-glow)');
    });
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = 'transparent';
      this.style.boxShadow = 'var(--shadow-md)';
    });

    return card;
  }

  /**
   * 批量渲染干部网格
   * @param {HTMLElement} container - 容器元素
   * @param {Array} data - 干部数组
   * @param {Function} onClick - 点击回调
   */
  function renderGrid(container, data, onClick) {
    if (!container) return;
    container.innerHTML = '';
    (data || []).forEach(function(d) {
      container.appendChild(render(d, onClick));
    });
  }

  /**
   * 显示微信二维码弹窗
   * 使用全局 showQR 或 openModal
   */
  function showQR(name) {
    if (typeof window.showQR === 'function') {
      window.showQR(name);
    } else if (typeof openModal === 'function' && typeof document !== 'undefined') {
      var box = document.getElementById('modalBox');
      if (box) {
        box.innerHTML = '<h3>💚 ' + name + ' — 微信二维码</h3>' +
          '<div style="text-align:center"><img src="qr-wechat.jpg" style="width:200px;height:200px;border-radius:12px;border:3px solid var(--pri);padding:8px;background:#fff">' +
          '<div style="font-size:11px;color:var(--td);margin-top:8px">扫码添加微信</div></div>' +
          '<button class="btn btn-outline btn-sm" style="margin-top:12px;width:100%" onclick="closeModal()">关闭</button>';
        document.getElementById('modal').classList.add('show');
      }
    }
  }

  return {
    render: render,
    renderGrid: renderGrid,
    showQR: showQR
  };
})();
