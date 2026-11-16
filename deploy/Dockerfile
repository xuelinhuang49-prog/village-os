# ============================================
# 数字乡村平台 - 后端 Dockerfile
# 多阶段构建: Maven 编译 → JRE 运行
# ============================================

# Stage 1: 编译
FROM maven:3.9-eclipse-temurin-25-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: 运行
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# 时区设置
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
