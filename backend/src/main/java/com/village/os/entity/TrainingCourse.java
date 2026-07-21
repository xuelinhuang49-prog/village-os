package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("training_courses")
public class TrainingCourse {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String category;
    private String teacher;
    private String teacherBio;
    private String date;
    private String time;
    private String duration;
    private Integer joined;
    private Integer limitCount;
    private String status;
    private String location;
    private String formatType;
    private String description;
    private String outline;
    private String materials;
}
