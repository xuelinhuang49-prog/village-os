package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Land;
import com.village.os.mapper.LandMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lands")
@RequiredArgsConstructor
public class LandController {

    private final LandMapper landMapper;
    private BaseService<LandMapper, Land> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(landMapper); }

    @GetMapping
    public Result<List<Land>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<Land> create(@RequestBody Land data) { svc.save(data); return Result.ok(data); }

    @PutMapping("/{id}")
    public Result<Land> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Land item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("未找到");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        return svc.removeById(id) ? Result.ok(Map.of("ok", true)) : Result.fail("未找到");
    }
}
