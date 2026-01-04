package com.campus.food.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 评价图片表
 */
@Data
@TableName("review_image")
public class ReviewImage {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 评价ID
     */
    private Long reviewId;

    /**
     * 图片URL
     */
    private String imageUrl;

    /**
     * 排序
     */
    private Integer sort;

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

