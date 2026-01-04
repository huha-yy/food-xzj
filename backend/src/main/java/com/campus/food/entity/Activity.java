package com.campus.food.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 活动表
 */
@Data
@TableName("activity")
public class Activity {

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
     * 活动标题
     */
    private String title;

    /**
     * 活动内容
     */
    private String content;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 审核人ID(ADMIN角色)
     */
    private Long auditorId;

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

