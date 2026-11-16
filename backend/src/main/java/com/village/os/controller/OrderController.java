package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Order;
import com.village.os.mapper.OrderMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderMapper mapper;
    private BaseService<OrderMapper, Order> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Order>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<Order> create(@RequestBody Order data) { svc.save(data); return Result.ok(data); }

    @PutMapping("/{id}")
    public Result<Order> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Order item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("未找到");
    }
}
