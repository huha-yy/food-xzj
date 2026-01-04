package com.campus.food.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 公告表
 */
@Data
@TableName("announcement")
public class Announcement {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 公告标题
     */
    private String title;

    /**
     * 公告内容
     */
    private String content;

    /**
     * 发布人ID(ADMIN角色)
     */
    private Long publisherId;

    /**
     * 发布时间
     */
    private LocalDateTime publishTime;

    /**
     * 状态(已发布/草稿)
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

