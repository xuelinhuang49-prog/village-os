package com.village.os.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 当前登录人工具类（行级权限过滤复用）。
 * user_id 即 farmer 主键 / admin 主键，由 JwtAuthenticationFilter 写入 credentials。
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    /** 当前登录人 ID（农户=farmer.id，管理员=admin.id），匿名返回 null */
    public static Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getCredentials() instanceof Long)) return null;
        return (Long) auth.getCredentials();
    }

    // —— 角色代号（与 JWT role claim / 登录返回 role 一致）——
    public static final String ROLE_SUPER_ADMIN = "SUPER_ADMIN";     // 平台超级管理员
    public static final String ROLE_VILLAGE_ADMIN = "VILLAGE_ADMIN"; // 村级管理员（村干部）
    public static final String ROLE_GRID_WORKER = "GRID_WORKER";     // 网格员
    public static final String ROLE_FARMER = "FARMER";               // 村民/农户
    public static final String ROLE_BUSINESS_ENTITY = "BUSINESS_ENTITY"; // 经营主体（合作社/家庭农场/农业企业）

    public static boolean isSuperAdmin() {
        return hasRole(ROLE_SUPER_ADMIN);
    }

    public static boolean isVillageAdmin() {
        return hasRole(ROLE_VILLAGE_ADMIN);
    }

    public static boolean isGridWorker() {
        return hasRole(ROLE_GRID_WORKER);
    }

    public static boolean isFarmer() {
        return hasRole(ROLE_FARMER);
    }

    public static boolean isBusinessEntity() {
        return hasRole(ROLE_BUSINESS_ENTITY);
    }

    /** 管理端任一角色（超级管理员/村级管理员/网格员），不含村民/经营主体 */
    public static boolean isStaff() {
        return isSuperAdmin() || isVillageAdmin() || isGridWorker();
    }

    /** 完整管理权（超级管理员/村级管理员）；网格员不在此列，保持既有 admin 端点语义 */
    public static boolean isAdmin() {
        return isSuperAdmin() || isVillageAdmin();
    }

    private static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }
}
