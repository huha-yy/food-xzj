package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统计数据VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsVO {

    /**
     * 用户总数
     */
    private Long userCount;

    /**
     * 商家总数
     */
    private Long merchantCount;

    /**
     * 菜品总数
     */
    private Long foodCount;

    /**
     * 评价总数
     */
    private Long reviewCount;
}

