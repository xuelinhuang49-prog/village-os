package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Crop;
import com.village.os.mapper.CropMapper;
import com.village.os.service.BaseService;
import com.village.os.util.SecurityUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropMapper mapper;
    private BaseService<CropMapper, Crop> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Crop>> list() {
        Long farmerId = SecurityUtils.isFarmer() ? SecurityUtils.currentUserId() : null;
        if (farmerId != null) return Result.ok(svc.list(new LambdaQueryWrapper<Crop>().eq(Crop::getFarmerId, farmerId)));
        return Result.ok(svc.list());
    }

    @PostMapping
    public Result<Crop> create(@RequestBody Crop data) {
        if (SecurityUtils.isFarmer()) data.setFarmerId(SecurityUtils.currentUserId());
        svc.save(data); return Result.ok(data);
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        return svc.removeById(id) ? Result.ok(Map.of("ok", true)) : Result.fail("未找到");
    }
}
