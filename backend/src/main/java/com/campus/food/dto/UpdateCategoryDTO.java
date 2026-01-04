package com.campus.food.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 修改分类DTO
 */
@Data
public class UpdateCategoryDTO {

    /**
     * 分类名称
     */
    @Size(max = 32, message = "分类名称长度不能超过32位")
    private String name;

    /**
     * 分类描述
     */
    @Size(max = 256, message = "分类描述长度不能超过256位")
    private String description;

    /**
     * 排序(数字越小越靠前)
     */
    private Integer sort;
}

