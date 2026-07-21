package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("irrigation_record")
public class IrrigationRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String deviceName;
    private String deviceId;
    private String area;
    private LocalDateTime startTime;
    private LocalDateTime stopTime;
    private Long durationSeconds;
    private String startMode;
    private String operator;
    private Double waterUsage;
    private Double avgFlow;
    private String soilBefore;
    private String soilAfter;
    private String status;
    private String errorNote;
    private LocalDateTime createTime;
}
