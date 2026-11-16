package com.village.os.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Token 工具类
 */
@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expiration = expiration;
    }

    /**
     * 生成 JWT Token（默认角色 admin，兼容管理端登录）
     */
    public String generateToken(Long userId, Long tenantId, Long villageId, String username) {
        return generateToken(userId, tenantId, villageId, username, "admin");
    }

    /**
     * 生成 JWT Token（携带角色，农户登录传 farmer）
     */
    public String generateToken(Long userId, Long tenantId, Long villageId, String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", userId);
        claims.put("tenant_id", tenantId);
        claims.put("village_id", villageId);
        claims.put("username", username);
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    /**
     * 从 Token 中解析 Claims
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.warn("JWT Token 已过期: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            log.error("JWT Token 解析失败: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 从 Token 中获取用户ID
     */
    public Long getUserId(String token) {
        Claims claims = parseToken(token);
        return claims.get("user_id", Long.class);
    }

    /**
     * 从 Token 中获取租户ID
     */
    public Long getTenantId(String token) {
        Claims claims = parseToken(token);
        return claims.get("tenant_id", Long.class);
    }

    /**
     * 从 Token 中获取村庄ID
     */
    public Long getVillageId(String token) {
        Claims claims = parseToken(token);
        return claims.get("village_id", Long.class);
    }

    /**
     * 验证 Token 是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
