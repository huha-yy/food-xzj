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
}

