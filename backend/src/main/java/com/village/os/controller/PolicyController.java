package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Policy;
import com.village.os.mapper.PolicyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 惠农政策（公域数据）—— 政府公开/互联网公开数据，全员可查、无需登录。
 * 对外只读，无写接口；数据由管理员端/运营后台维护。
 */
@RestController
@RequestMapping("/api/v1/policy")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyMapper mapper;

    /** 政策列表（公开可查，支持按分类筛选），按发布日期倒序 */
    @GetMapping("/list")
    public Result<List<Policy>> list(@RequestParam(required = false) String category) {
        LambdaQueryWrapper<Policy> w = new LambdaQueryWrapper<>();
        if (category != null && !category.isBlank()) w.eq(Policy::getCategory, category);
        w.eq(Policy::getStatus, "生效").orderByDesc(Policy::getPublishDate);
        return Result.ok(mapper.selectList(w));
    }
}
