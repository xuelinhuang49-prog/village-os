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
    /** owner_id 关联 admin_users.id（经营主体专属产品）；空 = 村集体台账 */
    private Long ownerId;
    /** farmer_id 关联 farmer.id（村民自己挂售的农产品）；空 = 非村民挂售 */
    private Long farmerId;
    /** 审核意见（村民上架被驳回时填写原因；通过后清空） */
    private String reviewNote;
}
