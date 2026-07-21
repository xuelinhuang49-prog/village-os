package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("scenic_spots")
public class ScenicSpot {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String type;
    private String level;
    private Double tickets;
    private Integer visitors;
    private String description;
    private String openTime;
    private String facilities;
}
