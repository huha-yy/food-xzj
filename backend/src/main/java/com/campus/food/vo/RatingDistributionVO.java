package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 评分分布VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDistributionVO {

    /**
     * 5星评价数量
     */
    private Long fiveStarCount;

    /**
     * 4星评价数量
     */
    private Long fourStarCount;

    /**
     * 3星评价数量
     */
    private Long threeStarCount;

    /**
     * 2星评价数量
     */
    private Long twoStarCount;

    /**
     * 1星评价数量
     */
    private Long oneStarCount;

    /**
     * 总评价数
     */
    private Long totalCount;

    /**
     * 平均评分
     */
    private Double averageRating;
}
