package com.campus.food.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;

/**
 * 收藏信息VO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionVO {

    /**
     * 收藏ID
     */
    private Long collectionId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 用户头像
     */
    private String avatar;

    /**
     * 收藏类型(MERCHANT=商家, FOOD=菜品)
     */
    private String type;

    /**
     * 目标ID(商家ID或菜品ID)
     */
    private Long targetId;

    /**
     * 目标名称(店铺名称或菜品名称)
     */
    private String targetName;

    /**
     * 目标图片URL(商家时返回商家封面图，菜品时返回菜品图片）
     */
    private String targetImage;

    /**
     * 价格(菜品时才返回)
     */
    private BigDecimal price;

    /**
     * 平均评分(菜品时才返回)
     */
    private BigDecimal ratingAvg;

    /**
     * 创建时间
     */
    private String createTime;
}

