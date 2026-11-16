package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 村民诉求上报表（私域数据）
 * 关联 farmer 表，farmer_id 由后端从 token 解析写入，前端不传，防止越权篡改
 */
@Data
@TableName("service_request")
public class ServiceRequest {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long farmerId;        // farmer_id 关联农户
    private String requestType;   // 诉求类型：民生/土地/产业/纠纷等
    private String content;       // 诉求详细内容
    private String contactPhone;  // 联系电话（前端展示脱敏）
    private String status;        // PENDING/PROCESSING/FINISHED/CLOSED
    private String adminReply;    // 村委管理员回复
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    /** 农户姓名（冗余展示，非表字段；管理员列表时按 farmer_id 回填） */
    @TableField(exist = false)
    private String farmerName;
}
