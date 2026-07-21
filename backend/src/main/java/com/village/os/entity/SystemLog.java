package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("system_logs")
public class SystemLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String time;
    private String user;
    private String action;
    private String type;
    private String ip;
}
