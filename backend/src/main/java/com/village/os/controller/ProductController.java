package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Product;
import com.village.os.mapper.ProductMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductMapper mapper;
    private BaseService<ProductMapper, Product> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Product>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<Product> create(@RequestBody Product data) { svc.save(data); return Result.ok(data); }

    @PutMapping("/{id}")
    public Result<Product> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Product item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("未找到");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        return svc.removeById(id) ? Result.ok(Map.of("ok", true)) : Result.fail("未找到");
    }
}
