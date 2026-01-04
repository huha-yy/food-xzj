package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 公告信息返回对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementVO {

    /**
     * 公告ID
     */
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
     * 发布人ID
     */
    private Long publisherId;

    /**
     * 发布人用户名
     */
    private String publisherName;

    /**
     * 发布时间
     */
    private String publishTime;

    /**
     * 状态
     */
    private String status;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 更新时间
     */
    private String updateTime;
}

