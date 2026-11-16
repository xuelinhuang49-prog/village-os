package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Livestock;
import com.village.os.mapper.LivestockMapper;
import com.village.os.service.BaseService;
import com.village.os.util.SecurityUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/livestock")
@RequiredArgsConstructor
public class LivestockController {

    private final LivestockMapper livestockMapper;
    private BaseService<LivestockMapper, Livestock> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(livestockMapper); }

    /** 列表（行级过滤：农户仅见本人养殖档案，管理员见全村） */
    @GetMapping
    public Result<List<Livestock>> list() {
        Long farmerId = SecurityUtils.isFarmer() ? SecurityUtils.currentUserId() : null;
        if (farmerId != null) return Result.ok(svc.list(new LambdaQueryWrapper<Livestock>().eq(Livestock::getFarmerId, farmerId)));
        return Result.ok(svc.list());
    }

    /** 详情 */
    @GetMapping("/{id}")
    public Result<Livestock> detail(@PathVariable Long id) {
        Livestock item = svc.getById(id);
        return item != null ? Result.ok(item) : Result.fail("档案信息加载失败，请重试");
    }

    /** 新增 */
    @PostMapping
    public Result<Livestock> create(@RequestBody Livestock data) {
        if (SecurityUtils.isFarmer()) data.setFarmerId(SecurityUtils.currentUserId());
        svc.save(data);
        return Result.ok(data);
    }

    /** 更新（按字段） */
    @PutMapping("/{id}")
    public Result<Livestock> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Livestock item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("档案信息加载失败，请重试");
    }

    /** 删除 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        return svc.removeById(id) ? Result.ok(Map.of("ok", true)) : Result.fail("未找到");
    }
}
