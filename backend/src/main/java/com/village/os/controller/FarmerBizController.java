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
 * 村民「我要卖」（私域数据）—— 行级权限核心示例
 * - /my-products：仅农户，后端强制 where farmer_id = 当前登录农户，防止越权看/改别人挂售的货
 * - /product：仅农户，farmer_id 从 token 解析写入，前端不传
 */
@RestController
@RequestMapping("/api/v1/farmer-biz")
@RequiredArgsConstructor
public class FarmerBizController {

    private final ProductMapper productMapper;

    /** 我挂售的农产品 */
    @GetMapping("/my-products")
    public Result<List<Product>> myProducts() {
        if (!SecurityUtils.isFarmer()) return Result.forbidden("请以农户身份登录");
        Long farmerId = SecurityUtils.currentUserId();
        if (farmerId == null) return Result.forbidden("登录态异常，请重新登录");
        List<Product> list = productMapper.selectList(
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getFarmerId, farmerId)
                        .orderByDesc(Product::getId));
        return Result.ok(list);
    }

    /** 上架产品：归属强制为当前农户 */
    @PostMapping("/product")
    public Result<Product> addProduct(@RequestBody Product req) {
        if (!SecurityUtils.isFarmer()) return Result.forbidden("请以农户身份登录");
        Long farmerId = SecurityUtils.currentUserId();
        if (farmerId == null) return Result.forbidden("登录态异常，请重新登录");
        req.setId(null);
        req.setFarmerId(farmerId);
        // 村民上架需经村管理员审核：提交即「待审核」，审核通过后才变为「在售」对外销售
        req.setStatus("待审核");
        if (req.getSales() == null) req.setSales(0);
        productMapper.insert(req);
        return Result.ok(req);
    }

    /** 下架/删除：只能删自己挂售的产品 */
    @DeleteMapping("/product/{id}")
    public Result<Void> deleteProduct(@PathVariable Long id) {
        if (!SecurityUtils.isFarmer()) return Result.forbidden("请以农户身份登录");
        Long farmerId = SecurityUtils.currentUserId();
        Product p = productMapper.selectById(id);
        if (p == null || !farmerId.equals(p.getFarmerId())) return Result.forbidden("只能删除自己的产品");
        productMapper.deleteById(id);
        return Result.ok();
    }
}
