package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Elder;
import com.village.os.mapper.ElderMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elders")
@RequiredArgsConstructor
public class ElderController {

    private final ElderMapper mapper;
    private BaseService<ElderMapper, Elder> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Elder>> list() { return Result.ok(svc.list()); }
}
