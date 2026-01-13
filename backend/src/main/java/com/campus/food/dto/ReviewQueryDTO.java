package com.campus.food.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 评价查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ReviewQueryDTO extends PageQueryDTO {

    /**
     * 菜品ID
     */
    private Long foodId;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 评分筛选（1-5星）
     */
    private Integer rating;

    /**
     * 排序字段（time-时间, hot-热度, rating-评分）
     */
    private String sortBy;

    /**
     * 排序方向（asc-升序, desc-降序）
     */
    private String sortOrder;
}

