package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("livestock")
public class Livestock {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String batchNo;
    private String batchName;
    private String category;
    private String type;
    private String breed;
    private Integer initialCount;
    private Integer count;
    private String unit;
    private String area;
    private String startDate;
    private String expectDate;
    private String stage;
    private String health;
    private String source;
    private String manager;
    private String phone;
    private String villageName;
    private String remark;
    private String updatedAt;
    private Long farmerId;
}
