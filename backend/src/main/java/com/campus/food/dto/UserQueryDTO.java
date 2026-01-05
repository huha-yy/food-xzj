package com.campus.food.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserQueryDTO extends PageQueryDTO {

    /**
     * 用户名（模糊查询）
     */
    private String keyword;

    /**
     * 角色类型（STUDENT-学生，MERCHANT-商家，ADMIN-管理员）
     */
    private String role;

    /**
     * 用户状态（ACTIVE-正常，INACTIVE-已禁用）
     */
    private String status;
}

