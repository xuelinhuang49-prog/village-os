package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("lands")
public class Land {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Double area;
    private String soilType;
    private String location;
    private String crop;
    private String status;
    private Boolean irrigation;
    private Double gisLat;
    private Double gisLng;
    private String createdAt;
}
