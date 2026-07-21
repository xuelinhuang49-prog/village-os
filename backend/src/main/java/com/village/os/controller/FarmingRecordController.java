package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.FarmingRecord;
import com.village.os.mapper.FarmingRecordMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farming-records")
@RequiredArgsConstructor
public class FarmingRecordController {

    private final FarmingRecordMapper mapper;
    private BaseService<FarmingRecordMapper, FarmingRecord> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<FarmingRecord>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<FarmingRecord> create(@RequestBody FarmingRecord data) { svc.save(data); return Result.ok(data); }
}
