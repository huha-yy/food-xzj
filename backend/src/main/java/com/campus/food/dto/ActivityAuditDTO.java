package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 活动审核请求对象
 */
@Data
public class ActivityAuditDTO {

    /**
     * 活动ID
     */
    @NotNull(message = "活动ID不能为空")
    private Long id;

    /**
     * 审核结果（APPROVED-通过，REJECTED-驳回）
     */
    @NotBlank(message = "审核结果不能为空")
    private String auditResult;

    /**
     * 审核理由（驳回时必填）
     */
    private String auditReason;
}

