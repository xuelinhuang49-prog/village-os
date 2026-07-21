package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("bnbs")
public class Bnb {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String owner;
    private String phone;
    private Integer rooms;
    private Double price;
    private Double rating;
    private Integer bookings;
    private String revenue;
    private String status;
    private String since;
    private String description;
    private String licenseNo;
    private String tags;
}
