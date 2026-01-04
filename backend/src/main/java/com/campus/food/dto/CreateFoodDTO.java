package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建菜品DTO
 */
@Data
public class CreateFoodDTO {

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 分类ID
     */
    @NotNull(message = "分类ID不能为空")
    private Long categoryId;

    /**
     * 菜品名称
     */
    @NotBlank(message = "菜品名称不能为空")
    @Size(max = 64, message = "菜品名称长度不能超过64位")
    private String name;

    /**
     * 价格
     */
    @NotNull(message = "价格不能为空")
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

