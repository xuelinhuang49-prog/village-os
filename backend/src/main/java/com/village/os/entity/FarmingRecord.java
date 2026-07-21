package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("farming_records")
public class FarmingRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String type;
    private String cropName;
    private String plot;
    private String date;
    private String detail;
    private String operator;
    private String weather;
}
