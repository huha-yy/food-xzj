package com.campus.food.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 评价表
 */
@Data
@TableName("review")
public class Review {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 评价用户ID
     */
    private Long userId;

    /**
     * 菜品ID
     */
    private Long foodId;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 评分(1-5)
     */
    private Integer rating;

    /**
     * 评价内容
     */
    private String content;

    /**
     * 点赞数
     */
    private Integer likeCount;

    /**
     * 踩数
     */
    private Integer dislikeCount;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 审核人ID
     */
    private Long auditAdminId;

    /**
     * 审核时间
     */
    private LocalDateTime auditTime;

    /**
     * 审核理由(驳回时填写)
     */
    private String auditReason;

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

