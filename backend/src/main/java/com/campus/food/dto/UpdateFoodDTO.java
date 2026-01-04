package com.campus.food.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 修改菜品DTO
 */
@Data
public class UpdateFoodDTO {

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 菜品名称
     */
    @Size(max = 64, message = "菜品名称长度不能超过64位")
    private String name;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 菜品描述
     */
    @Size(max = 500, message = "菜品描述长度不能超过500位")
    private String description;

    /**
     * 菜品图片URL
     */
    private String imageUrl;
}

