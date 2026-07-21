package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("orders")
public class Order {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private String productName;
    private String buyer;
    private Integer quantity;
    private Double amount;
    private String status;
    private String date;
    private String logistics;
    private String address;
    private String phone;
    private String orderType;
}
