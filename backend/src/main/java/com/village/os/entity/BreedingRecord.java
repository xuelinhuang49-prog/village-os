package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("breeding_record")
public class BreedingRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long archiveId;
    private String batchNo;
    private String batchName;
    /** 记录类型：投喂记录/用药记录/消毒记录/转池记录/死亡记录/采样记录/其他记录 */
    private String type;
    private String content;
    private String recordTime;
    private String recorder;
    private String createdAt;
}
