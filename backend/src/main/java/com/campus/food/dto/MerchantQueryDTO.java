package com.campus.food.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 商家查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MerchantQueryDTO extends PageQueryDTO {

    /**
     * 关键词（店铺名称）
     */
    private String keyword;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 店铺状态
     */
    private String status;
}

