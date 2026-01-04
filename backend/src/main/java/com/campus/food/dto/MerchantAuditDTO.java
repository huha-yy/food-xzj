package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 商家审核DTO
 */
@Data
public class MerchantAuditDTO {

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 审核状态
     */
    @NotBlank(message = "审核状态不能为空")
    private String auditStatus;

    /**
     * 审核理由（驳回时必填）
     */
    private String auditReason;
}

