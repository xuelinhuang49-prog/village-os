package com.village.os.controller;

import com.village.os.common.Result;
import com.village.os.entity.TrainingCourse;
import com.village.os.mapper.TrainingCourseMapper;
import com.village.os.service.BaseService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training-courses")
@RequiredArgsConstructor
public class TrainingCourseController {

    private final TrainingCourseMapper mapper;
    private BaseService<TrainingCourseMapper, TrainingCourse> svc;

    @PostConstruct
    void init() { svc = new BaseService<>(mapper); }

    @GetMapping
    public Result<List<TrainingCourse>> list() { return Result.ok(svc.list()); }

    @PostMapping
    public Result<TrainingCourse> create(@RequestBody TrainingCourse data) { svc.save(data); return Result.ok(data); }
}
