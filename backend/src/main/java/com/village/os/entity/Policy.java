package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 惠农政策（公域数据 —— 政府公开/互联网公开数据，全员可查，无需登录）
 * 区别于私域数据（如 service_request 村民诉求），政策数据天然公开，不涉及个人隐私。
 */
@Data
@TableName("policy")
public class Policy {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;        // 政策标题
    private String category;     // 分类：惠农补贴 / 养老医保 / 产业发展 / 土地确权 / 其他
    private String source;       // 发布来源：县农业农村局 / 省人社厅 等
    private String publishDate;  // 发布日期（yyyy-MM-dd）
    private String summary;      // 一句话摘要
    private String content;      // 政策正文（纯文本，\n 分段）
    private String status;       // 生效 / 废止
    private LocalDateTime createTime;
}
