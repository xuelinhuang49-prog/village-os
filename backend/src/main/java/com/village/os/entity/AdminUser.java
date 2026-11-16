package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("admin_users")
public class AdminUser {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String password;
    private String name;
    private String role;
    private String org;
    private String gridId;
    private String phone;
    private String status;
    private String permissions;
    private String avatarColor;
    private String lastLogin;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
