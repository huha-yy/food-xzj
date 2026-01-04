package com.campus.food.vo;

import lombok.Data;

/**
 * 分类信息VO
 */
@Data
public class CategoryVO {

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 分类名称
     */
    private String name;

    /**
     * 分类描述
     */
    private String description;

    /**
     * 排序(数字越小越靠前)
     */
    private Integer sort;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 更新时间
     */
    private String updateTime;
}

