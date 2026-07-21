package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Insurance;
import com.village.os.mapper.InsuranceMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurances")
@RequiredArgsConstructor
public class InsuranceController {

    private final InsuranceMapper mapper;
    private BaseService<InsuranceMapper, Insurance> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Insurance>> list() { return Result.ok(svc.list()); }
}
