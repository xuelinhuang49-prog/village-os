package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("products")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String category;
    private Double price;
    private String unit;
    private Integer stock;
    private Integer sales;
    private String status;
    private String description;
    private String farmer;
    private String plot;
    private String traceId;
    private String plantDate;
    private String harvestDate;
}
