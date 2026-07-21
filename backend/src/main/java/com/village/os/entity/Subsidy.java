package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("subsidies")
public class Subsidy {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String type;
    private Double amount;
    private String status;
    private String date;
    private Integer progress;
    private String material;
    private String handler;
}
