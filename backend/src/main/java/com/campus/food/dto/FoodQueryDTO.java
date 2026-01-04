package com.campus.food.dto;

import lombok.Data;

/**
 * 菜品查询DTO
 */
@Data
public class FoodQueryDTO {

    /**
     * 关键词（菜品名称）
     */
    private String keyword;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 状态（上架/下架）
     */
    private String status;

    /**
     * 当前页
     */
    private Long current = 1L;

    /**
     * 每页大小
     */
    private Long pageSize = 10L;
}

