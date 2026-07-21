package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("elders")
public class Elder {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String address;
    private String livingType;
    private String contact;
    private String contactPhone;
    private String device;
    private String status;
    private String lastActive;
    private String health;
    private Integer alert24h;
    private Integer alertMonth;
    private String emergency;
}
