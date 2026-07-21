package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.ScenicSpot;
import com.village.os.mapper.ScenicSpotMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scenic-spots")
@RequiredArgsConstructor
public class ScenicSpotController {

    private final ScenicSpotMapper mapper;
    private BaseService<ScenicSpotMapper, ScenicSpot> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<ScenicSpot>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<ScenicSpot> create(@RequestBody ScenicSpot data) { svc.save(data); return Result.ok(data); }
}
