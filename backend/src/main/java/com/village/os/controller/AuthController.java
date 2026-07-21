package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.AdminUser;
import com.village.os.mapper.AdminUserMapper;
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

        String token = jwtTokenProvider.generateToken(user.getId(), 1L, 1L, user.getUsername());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("role", user.getRole());
        result.put("token", token);
        return Result.ok(result);
    }

    @Data
    static class LoginRequest {
        String username;
        String password;
    }
}
