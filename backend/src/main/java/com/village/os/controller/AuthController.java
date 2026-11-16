package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.AdminUser;
import com.village.os.entity.Farmer;
import com.village.os.mapper.AdminUserMapper;
import com.village.os.mapper.FarmerMapper;
import com.village.os.security.JwtTokenProvider;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AdminUserMapper adminUserMapper;
    private final FarmerMapper farmerMapper;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/api/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest req) {
        AdminUser user = adminUserMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<AdminUser>()
                        .eq(AdminUser::getUsername, req.username)
        );
        if (user == null || !user.getPassword().equals(req.password)) {
            return Result.fail(401, "账号或密码错误");
        }

        user.setStatus("在线");
        user.setLastLogin("刚刚");
        adminUserMapper.updateById(user);

        String roleCode = roleToCode(user.getRole());
        String token = jwtTokenProvider.generateToken(user.getId(), 1L, 1L, user.getUsername(), roleCode);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("role", roleCode);
        result.put("roleLabel", roleLabel(roleCode));
        result.put("org", user.getOrg());
        result.put("gridId", user.getGridId());
        result.put("token", token);
        return Result.ok(result);
    }

    /**
     * 农户登录：账号=姓名拼音+123，初始密码 123456，签发真实 JWT（角色 farmer）
     */
    @PostMapping("/api/farmer/login")
    public Result<Map<String, Object>> farmerLogin(@RequestBody LoginRequest req) {
        Farmer farmer = farmerMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Farmer>()
                        .eq(Farmer::getUsername, req.username)
        );
        if (farmer == null || !farmer.getPassword().equals(req.password)) {
            return Result.fail(401, "账号或密码错误");
        }

        farmer.setStatus("在线");
        farmer.setLastLogin("刚刚");
        farmerMapper.updateById(farmer);

        String token = jwtTokenProvider.generateToken(farmer.getId(), 1L, 1L, farmer.getUsername(), "farmer");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", farmer.getId());
        result.put("username", farmer.getUsername());
        result.put("name", farmer.getName());
        result.put("farmerId", farmer.getFarmerId());
        result.put("village", farmer.getVillage());
        result.put("zone", farmer.getZone());
        result.put("grid", farmer.getGrid());
        result.put("gridId", farmer.getGridId());
        result.put("phone", farmer.getPhone());
        result.put("role", "FARMER");
        result.put("roleLabel", "村民");
        result.put("token", token);
        return Result.ok(result);
    }

    /** 兼容旧数据：把中文角色名归一为角色代号（已是代号则原样返回） */
    private String roleToCode(String role) {
        if (role == null) return "VILLAGE_ADMIN";
        return switch (role) {
            case "超级管理员" -> "SUPER_ADMIN";
            case "管理员", "运营经理", "操作员" -> "VILLAGE_ADMIN";
            case "网格员" -> "GRID_WORKER";
            case "村民" -> "FARMER";
            case "经营主体", "合作社", "家庭农场", "农业企业" -> "BUSINESS_ENTITY";
            default -> role;
        };
    }

    private String roleLabel(String code) {
        return switch (code) {
            case "SUPER_ADMIN" -> "平台超级管理员";
            case "VILLAGE_ADMIN" -> "村级管理员";
            case "GRID_WORKER" -> "网格员";
            case "FARMER" -> "村民";
            case "BUSINESS_ENTITY" -> "经营主体";
            default -> code;
        };
    }

    @Data
    static class LoginRequest {
        String username;
        String password;
    }
}
