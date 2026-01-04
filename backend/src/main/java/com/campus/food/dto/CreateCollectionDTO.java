package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 创建收藏DTO
 */
@Data
public class CreateCollectionDTO {

    /**
     * 收藏类型(MERCHANT=商家, FOOD=菜品)
     */
    @NotBlank(message = "收藏类型不能为空")
    @Size(max = 16, message = "收藏类型长度不能超过16位")
    private String type;

    /**
     * 目标ID(商家ID或菜品ID)
     */
    @NotNull(message = "目标ID不能为空")
    private Long targetId;
}

