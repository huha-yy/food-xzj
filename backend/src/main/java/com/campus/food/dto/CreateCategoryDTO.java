package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 创建分类DTO
 */
@Data
public class CreateCategoryDTO {

    /**
     * 创建者ID
     */
    private Long creatorId;

    /**
     * 分类名称
     */
    @NotBlank(message = "分类名称不能为空")
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

