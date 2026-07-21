package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.Bnb;
import com.village.os.mapper.BnbMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bnbs")
@RequiredArgsConstructor
public class BnbController {

    private final BnbMapper mapper;
    private BaseService<BnbMapper, Bnb> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<Bnb>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<Bnb> create(@RequestBody Bnb data) { svc.save(data); return Result.ok(data); }

    @PutMapping("/{id}")
    public Result<Bnb> update(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        Bnb item = svc.updateFields(id, fields);
        return item != null ? Result.ok(item) : Result.fail("未找到");
    }
}
