package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.BreedingRecord;
import com.village.os.mapper.BreedingRecordMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/breeding-records")
@RequiredArgsConstructor
public class BreedingRecordController {

    private final BreedingRecordMapper breedingRecordMapper;
    private BaseService<BreedingRecordMapper, BreedingRecord> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(breedingRecordMapper); }

    /** 列表（可按 archiveId 筛选） */
    @GetMapping
    public Result<List<BreedingRecord>> list(@RequestParam(required = false) Long archiveId) {
        if (archiveId != null) {
            return Result.ok(svc.list(new LambdaQueryWrapper<BreedingRecord>()
                    .eq(BreedingRecord::getArchiveId, archiveId)
                    .orderByDesc(BreedingRecord::getRecordTime)));
        }
        return Result.ok(svc.list());
    }

    /** 详情 */
    @GetMapping("/{id}")
    public Result<BreedingRecord> detail(@PathVariable Long id) {
        BreedingRecord item = svc.getById(id);
        return item != null ? Result.ok(item) : Result.fail("养殖记录不存在");
    }

    /** 新增 */
    @PostMapping
    public Result<BreedingRecord> create(@RequestBody BreedingRecord data) {
        svc.save(data);
        return Result.ok(data);
    }

    /** 更新 */
    @PutMapping("/{id}")
    public Result<BreedingRecord> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        BreedingRecord item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("养殖记录不存在");
    }

    /** 删除 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        return svc.removeById(id) ? Result.ok(Map.of("ok", true)) : Result.fail("未找到");
    }
}
