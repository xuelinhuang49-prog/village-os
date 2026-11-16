package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Land;
import com.village.os.mapper.LandMapper;
import com.village.os.service.BaseService;
import com.village.os.util.SecurityUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lands")
@RequiredArgsConstructor
public class LandController {

    private final LandMapper landMapper;
    private BaseService<LandMapper, Land> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(landMapper); }

    @GetMapping
    public Result<List<Land>> list() {
        // 行级过滤：农户仅见本人地块，管理员见全村
        Long farmerId = SecurityUtils.isFarmer() ? SecurityUtils.currentUserId() : null;
        if (farmerId != null) return Result.ok(svc.list(new LambdaQueryWrapper<Land>().eq(Land::getFarmerId, farmerId)));
        return Result.ok(svc.list());
    }

    @PostMapping
    public Result<Land> create(@RequestBody Land data) {
        // 农户自建数据归属本人
        if (SecurityUtils.isFarmer()) data.setFarmerId(SecurityUtils.currentUserId());
        svc.save(data); return Result.ok(data);
    }

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
