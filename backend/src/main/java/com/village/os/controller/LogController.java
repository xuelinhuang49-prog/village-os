package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.SystemLog;
import com.village.os.mapper.SystemLogMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final SystemLogMapper mapper;
    private BaseService<SystemLogMapper, SystemLog> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<SystemLog>> list() { return Result.ok(svc.list()); }
}
