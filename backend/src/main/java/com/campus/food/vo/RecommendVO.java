package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 推荐菜品返回对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendVO {

    /**
     * 菜品ID
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
     * 分类ID
     */
    private Long categoryId;

    /**
     * 分类名称
     */
    private String categoryName;

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
     * 热度分（用于排序）
     */
    private Double hotScore;
}

