package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Subsidy;
import com.village.os.mapper.SubsidyMapper;
import com.village.os.service.BaseService;
import com.village.os.util.SecurityUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/subsidies")
@RequiredArgsConstructor
public class SubsidyController {

    private final SubsidyMapper mapper;
    private BaseService<SubsidyMapper, Subsidy> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Subsidy>> list() {
        Long farmerId = SecurityUtils.isFarmer() ? SecurityUtils.currentUserId() : null;
        if (farmerId != null) return Result.ok(svc.list(new LambdaQueryWrapper<Subsidy>().eq(Subsidy::getFarmerId, farmerId)));
        return Result.ok(svc.list());
    }

    @PostMapping
    public Result<Subsidy> create(@RequestBody Subsidy data) {
        if (SecurityUtils.isFarmer()) data.setFarmerId(SecurityUtils.currentUserId());
        svc.save(data); return Result.ok(data);
    }

    @PutMapping("/{id}")
    public Result<Subsidy> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Subsidy item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("未找到");
    }
}
