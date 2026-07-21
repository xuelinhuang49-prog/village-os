#!/bin/bash
# ============================================
#  数字乡村平台 - 前端启动脚本 (Linux/macOS)
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../frontend"

echo "============================================"
echo "  数字乡村平台 - 前端启动"
echo "============================================"
echo ""

# 检查 Node.js
echo "[1/3] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] 未找到 Node.js，请安装 Node.js 18+"
    exit 1
fi
echo "      Node.js 环境正常: $(node --version)"

# 安装依赖
echo "[2/3] 安装依赖..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install
    echo "      依赖安装完成"
else
    echo "      依赖已存在，跳过安装"
fi

# 启动
echo "[3/3] 启动 Vue3 开发服务器..."
npm run dev
