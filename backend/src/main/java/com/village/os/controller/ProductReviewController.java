package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Farmer;
import com.village.os.entity.Product;
import com.village.os.mapper.FarmerMapper;
import com.village.os.mapper.ProductMapper;
import com.village.os.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 村民上架审核（管理端）：村干部/管理员对村民提交的农产品进行「通过 / 驳回」。
 * - 村民提交后 status=待审核，不对外销售
 * - 通过 → status=在售；驳回 → status=已驳回 + 审核意见（review_note），村民可看到原因
 * 仅管理端角色（超级管理员/村干部/网格员）可操作。
 */
@RestController
@RequestMapping("/api/v1/admin/product-review")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductMapper productMapper;
    private final FarmerMapper farmerMapper;

    /** 待审核的村民产品（farmer_id 非空 & status=待审核），按提交先后倒序；附带村民姓名 */
    @GetMapping("/pending")
    public Result<List<Product>> pending() {
        if (!SecurityUtils.isStaff()) return Result.forbidden("请以管理员身份登录");
        List<Product> list = productMapper.selectList(
                new LambdaQueryWrapper<Product>()
                        .isNotNull(Product::getFarmerId)
                        .eq(Product::getStatus, "待审核")
                        .orderByDesc(Product::getId));
        List<Long> farmerIds = list.stream().map(Product::getFarmerId).distinct().collect(Collectors.toList());
        if (!farmerIds.isEmpty()) {
            Map<Long, String> nameMap = farmerMapper.selectBatchIds(farmerIds).stream()
                    .collect(Collectors.toMap(Farmer::getId, Farmer::getName, (a, b) -> a));
            list.forEach(p -> p.setFarmer(nameMap.getOrDefault(p.getFarmerId(), "村民")));
        }
        return Result.ok(list);
    }

    /** 通过审核：转为在售，清空审核意见 */
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id) {
        if (!SecurityUtils.isStaff()) return Result.forbidden("请以管理员身份登录");
        Product p = productMapper.selectById(id);
        if (p == null) return Result.fail("产品不存在");
        p.setStatus("在售");
        p.setReviewNote(null);
        productMapper.updateById(p);
        return Result.ok();
    }

    /** 驳回：转为已驳回，记录审核意见供村民查看 */
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        if (!SecurityUtils.isStaff()) return Result.forbidden("请以管理员身份登录");
        Product p = productMapper.selectById(id);
        if (p == null) return Result.fail("产品不存在");
        String note = (body == null ? null : body.get("note"));
        if (note == null || note.isBlank()) note = "信息不完整或不符合上架要求";
        p.setStatus("已驳回");
        p.setReviewNote(note);
        productMapper.updateById(p);
        return Result.ok();
    }
}
