#!/usr/bin/env bash
set -e

# 定位到 backend 目录（本脚本位于 deploy/ 下）
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../backend" && pwd)"
cd "$DIR"

JAR="target/village-os-backend-1.0.0-SNAPSHOT.jar"
if [ ! -f "$JAR" ]; then
  echo "[错误] 找不到 $JAR"
  echo "请先在 backend 目录执行：./mvnw clean package -Dmaven.test.skip=true"
  exit 1
fi

echo "============================================"
echo "  数字乡村平台 · 后端服务"
echo "  端口：8080"
echo "  数据文件：backend/data/village_os.mv.db"
echo "  按 Ctrl+C 停止"
echo "============================================"
exec java -jar "$JAR"
