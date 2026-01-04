package com.campus.food.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 菜品信息VO
 */
@Data
public class FoodVO {

    /**
     * 菜品ID
     */
    private Long foodId;

    /**
     * 商家ID
     */
    private Long merchantId;

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
     * 上下架状态
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

