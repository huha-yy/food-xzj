package com.campus.food.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商家表
 */
@Data
@TableName("merchant")
public class Merchant {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联用户ID(MERCHANT角色)
     */
    private Long userId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 店铺地址
     */
    private String address;

    /**
     * 店铺描述
     */
    private String description;

    /**
     * 封面图URL
     */
    private String coverImage;

    /**
     * 坐标X
     */
    private BigDecimal coordinateX;

    /**
     * 坐标Y
     */
    private BigDecimal coordinateY;

    /**
     * 营业时间
     */
    private String openingHours;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 店铺状态
     */
    private String status;

    /**
     * 创建者ID
     */
    private Long creatorId;

    /**
     * 更新者ID
     */
    private Long updaterId;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除(0=未删,1=已删)
     */
    @TableLogic
    private Integer isDeleted;
}

