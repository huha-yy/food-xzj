package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 修改活动请求对象
 */
@Data
public class UpdateActivityDTO {

    /**
     * 活动ID
     */
    @NotNull(message = "活动ID不能为空")
    private Long id;

    /**
     * 活动标题
     */
    @NotBlank(message = "活动标题不能为空")
    private String title;

    /**
     * 活动内容
     */
    @NotBlank(message = "活动内容不能为空")
    private String content;

    /**
     * 开始时间
     */
    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;
}

