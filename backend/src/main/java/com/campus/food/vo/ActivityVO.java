package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 活动信息返回对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityVO {

    /**
     * 活动ID
     */
    private Long id;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 商家名称
     */
    private String merchantName;

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
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 审核人ID
     */
    private Long auditorId;

    /**
     * 审核人用户名
     */
    private String auditorName;

    /**
     * 审核时间
     */
    private String auditTime;

    /**
     * 审核理由
     */
    private String auditReason;

    /**
     * 活动图片列表
     */
    private List<String> imageUrls;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 更新时间
     */
    private String updateTime;
}

