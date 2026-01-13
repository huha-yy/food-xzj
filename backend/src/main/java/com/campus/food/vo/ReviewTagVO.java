package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 评价标签VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewTagVO {

    /**
     * 标签ID
     */
    private Long tagId;

    /**
     * 标签名称
     */
    private String name;

    /**
     * 标签类型(POSITIVE正面/NEGATIVE负面/NEUTRAL中性)
     */
    private String type;

    /**
     * 标签图标
     */
    private String icon;

    /**
     * 使用次数（可选，用于统计）
     */
    private Integer useCount;
}
