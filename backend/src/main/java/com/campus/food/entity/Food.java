package com.campus.food.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 菜品表
 */
@Data
@TableName("food")
public class Food {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 菜品名称
     */
    private String name;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 菜品描述
     */
    private String description;

    /**
     * 菜品图片URL
     */
    private String imageUrl;

    /**
     * 销量
     */
    private Integer salesCount;

    /**
     * 平均评分
     */
    private BigDecimal ratingAvg;

    /**
     * 上下架状态
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

