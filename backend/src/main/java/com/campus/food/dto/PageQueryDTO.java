package com.campus.food.dto;

import lombok.Data;

/**
 * 分页查询DTO
 */
@Data
public class PageQueryDTO {

    /**
     * 当前页
     */
    private Integer current = 1;

    /**
     * 每页大小
     */
    private Integer pageSize = 10;

    /**
     * 关键字（模糊查询）
     */
    private String keyword;
}

