package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.*;
import com.village.os.mapper.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatsController {

    private final LandMapper landMapper;
    private final CropMapper cropMapper;
    private final ProductMapper productMapper;
    private final OrderMapper orderMapper;
    private final BnbMapper bnbMapper;
    private final ElderMapper elderMapper;
    private final AdminUserMapper adminUserMapper;

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        List<Order> orders = orderMapper.selectList(null);
        List<Bnb> bnbs = bnbMapper.selectList(null);

        double ordersTotal = orders.stream().mapToDouble(o -> o.getAmount() != null ? o.getAmount() : 0).sum();
        double bnbsRevenue = bnbs.stream()
                .filter(b -> b.getRevenue() != null)
                .mapToDouble(b -> {
                    try {
                        return Double.parseDouble(b.getRevenue().replace("¥", "").replace("万", "")) * 10000;
                    } catch (Exception e) { return 0; }
                }).sum();
        long usersOnline = adminUserMapper.selectList(null).stream()
                .filter(u -> "在线".equals(u.getStatus())).count();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("lands_count", landMapper.selectCount(null));
        data.put("crops_count", cropMapper.selectCount(null));
        data.put("products_count", productMapper.selectCount(null));
        data.put("orders_count", orderMapper.selectCount(null));
        data.put("orders_total", ordersTotal);
        data.put("bnbs_count", bnbMapper.selectCount(null));
        data.put("bnbs_revenue", bnbsRevenue);
        data.put("elders_count", elderMapper.selectCount(null));
        data.put("users_online", usersOnline);
        return Result.ok(data);
    }
}
