package com.campus.food.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 公告查询请求对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AnnouncementQueryDTO extends PageQueryDTO {

    /**
     * 关键词（标题或内容）
     */
    private String keyword;

    /**
     * 状态（PUBLISHED-已发布，DRAFT-草稿）
     */
    private String status;
}

