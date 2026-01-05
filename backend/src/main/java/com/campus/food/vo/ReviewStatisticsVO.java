package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 评价统计数据VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatisticsVO {

    /**
     * 评价总数
     */
    private Long totalCount;

    /**
     * 平均评分
     */
    private Double averageRating;

    /**
     * 今日新增评价数
     */
    private Long todayCount;
}
