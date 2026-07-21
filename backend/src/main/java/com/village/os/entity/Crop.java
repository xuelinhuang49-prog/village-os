package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("crops")
public class Crop {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String variety;
    private String plantDate;
    private String cycle;
    private String expectedYield;
    private Double area;
    private String stage;
    private String fertilizer;
    private String status;
    private String description;
}
