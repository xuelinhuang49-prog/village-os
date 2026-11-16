package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Product;
import com.village.os.mapper.ProductMapper;
import com.village.os.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 经营主体工作台（私域数据）—— 行级权限核心示例
 * - /my-products：仅经营主体，后端强制 where owner_id = 当前登录经营主体，防止越权看别人产品
 * - /product：仅经营主体，owner_id 从 token 解析写入，前端不传，防止篡改挂到别人名下
 */
@RestController
@RequestMapping("/api/v1/business")
@RequiredArgsConstructor
public class BusinessController {

    private final ProductMapper productMapper;

    /** 我的产品：仅返回当前经营主体自己的产品 */
    @GetMapping("/my-products")
    public Result<List<Product>> myProducts() {
        if (!SecurityUtils.isBusinessEntity()) return Result.forbidden("仅经营主体可访问");
        Long ownerId = SecurityUtils.currentUserId();
        if (ownerId == null) return Result.forbidden("登录态异常，请重新登录");
        List<Product> list = productMapper.selectList(
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getOwnerId, ownerId)
                        .orderByDesc(Product::getId));
        return Result.ok(list);
    }

    /** 添加产品：归属强制为当前经营主体 */
    @PostMapping("/product")
    public Result<Product> addProduct(@RequestBody Product req) {
        if (!SecurityUtils.isBusinessEntity()) return Result.forbidden("仅经营主体可操作");
        Long ownerId = SecurityUtils.currentUserId();
        if (ownerId == null) return Result.forbidden("登录态异常，请重新登录");
        req.setId(null);
        req.setOwnerId(ownerId);
        if (req.getStatus() == null || req.getStatus().isBlank()) req.setStatus("上架");
        if (req.getSales() == null) req.setSales(0);
        productMapper.insert(req);
        return Result.ok(req);
    }

    /** 删除产品：只能删自己名下的产品，防止越权删别人数据 */
    @DeleteMapping("/product/{id}")
    public Result<Void> deleteProduct(@PathVariable Long id) {
        if (!SecurityUtils.isBusinessEntity()) return Result.forbidden("仅经营主体可操作");
        Long ownerId = SecurityUtils.currentUserId();
        Product p = productMapper.selectById(id);
        if (p == null || !ownerId.equals(p.getOwnerId())) return Result.forbidden("只能删除自己的产品");
        productMapper.deleteById(id);
        return Result.ok();
    }
}
