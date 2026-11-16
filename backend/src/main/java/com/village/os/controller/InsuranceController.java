package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Insurance;
import com.village.os.mapper.InsuranceMapper;
import com.village.os.service.BaseService;
import com.village.os.util.SecurityUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insurances")
@RequiredArgsConstructor
public class InsuranceController {

    private final InsuranceMapper mapper;
    private BaseService<InsuranceMapper, Insurance> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Insurance>> list() {
        Long farmerId = SecurityUtils.isFarmer() ? SecurityUtils.currentUserId() : null;
        if (farmerId != null) return Result.ok(svc.list(new LambdaQueryWrapper<Insurance>().eq(Insurance::getFarmerId, farmerId)));
        return Result.ok(svc.list());
    }
}
