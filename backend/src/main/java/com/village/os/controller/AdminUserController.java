package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.AdminUser;
import com.village.os.mapper.AdminUserMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserMapper mapper;
    private BaseService<AdminUserMapper, AdminUser> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping("/users")
    public Result<List<AdminUser>> list() { return Result.ok(svc.list()); }
}
