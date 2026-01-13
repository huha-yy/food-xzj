package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.List;

/**
 * 创建评价DTO
 */
@Data
public class CreateReviewDTO {

    /**
     * 菜品ID
     */
    @NotNull(message = "菜品ID不能为空")
    private Long foodId;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 评分(1-5)
     */
    @NotNull(message = "评分不能为空")
    @Min(value = 1, message = "评分最小为1")
    @Max(value = 5, message = "评分最大为5")
    private Integer rating;

    /**
     * 评价内容
     */
    @NotBlank(message = "评价内容不能为空")
    @Size(max = 500, message = "评价内容长度不能超过500位")
    private String content;

    /**
     * 评价图片URL列表
     */
    private List<String> imageUrls;

    /**
     * 评价标签ID列表
     */
    private List<Long> tagIds;
}

