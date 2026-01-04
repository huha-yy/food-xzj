package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 评价审核DTO
 */
@Data
public class ReviewAuditDTO {

    /**
     * 评价ID
     */
    @NotNull(message = "评价ID不能为空")
    private Long reviewId;

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

