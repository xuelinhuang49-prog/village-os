#!/bin/bash
# ============================================
#  数字乡村平台 - 后端启动脚本 (Linux/macOS)
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../backend"

echo "============================================"
echo "  数字乡村平台 - 后端启动"
echo "============================================"
echo ""

# 检查 Java
echo "[1/3] 检查 Java 环境..."
if ! command -v java &> /dev/null; then
    echo "[ERROR] 未找到 Java，请安装 JDK 17+"
    exit 1
fi
echo "      Java 环境正常: $(java -version 2>&1 | head -1)"

# 检查 PostgreSQL
echo "[2/3] 检查 PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "      PostgreSQL 可用"
else
    echo "      [WARN] 未检测到 psql 命令，请确保 PostgreSQL 已启动"
fi

# 启动
echo "[3/3] 启动 Spring Boot..."
cd "$BACKEND_DIR"
./mvnw spring-boot:run
