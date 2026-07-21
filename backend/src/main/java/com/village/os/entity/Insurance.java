package com.village.os.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("insurances")
public class Insurance {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String idCard;
    private String medType;
    private String medStatus;
    private String medBalance;
    private String pensionType;
    private String penStatus;
    private String penBalance;
    private String penMonthly;
    private String lastMedPay;
    private String lastVisit;
    private String hospital;
    private String diagnosis;
    private String reimburse;
}
