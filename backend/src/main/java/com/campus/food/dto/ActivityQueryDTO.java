package com.campus.food.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 活动查询请求对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ActivityQueryDTO extends PageQueryDTO {

    /**
     * 关键词（标题或内容）
     */
    private String keyword;

    /**
     * 审核状态（PENDING-待审核，APPROVED-已通过，REJECTED-已驳回）
     */
    private String auditStatus;

    /**
     * 商家ID
     */
    private Long merchantId;
}

