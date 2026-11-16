package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("farmer")
public class Farmer {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;   // 登录账号：姓名拼音 + 123
    private String password;   // 初始密码 123456
    private String name;       // 真实姓名
    private String farmerId;   // 业务档案ID（如 farmer_001）
    private String village;    // 所属村
    private String zone;       // 村组片区
    private String grid;       // 网格
    private String gridId;     // 网格ID
    private String phone;      // 脱敏手机号
    private String role;       // 固定「村民」
    private String status;     // 在线/离线
    private String lastLogin;
}
