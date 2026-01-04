package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建公告请求对象
 */
@Data
public class CreateAnnouncementDTO {

    /**
     * 公告标题
     */
    @NotBlank(message = "公告标题不能为空")
    private String title;

    /**
     * 公告内容
     */
    @NotBlank(message = "公告内容不能为空")
    private String content;

    /**
     * 状态（PUBLISHED-已发布，DRAFT-草稿）
     */
    private String status;
}

