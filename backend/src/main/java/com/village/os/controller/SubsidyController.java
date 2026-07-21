package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Subsidy;
import com.village.os.mapper.SubsidyMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subsidies")
@RequiredArgsConstructor
public class SubsidyController {

    private final SubsidyMapper mapper;
    private BaseService<SubsidyMapper, Subsidy> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Subsidy>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<Subsidy> create(@RequestBody Subsidy data) { svc.save(data); return Result.ok(data); }

    @PutMapping("/{id}")
    public Result<Subsidy> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Subsidy item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("未找到");
    }
}
