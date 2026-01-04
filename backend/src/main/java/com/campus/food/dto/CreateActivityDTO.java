package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 创建活动请求对象
 */
@Data
public class CreateActivityDTO {

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

