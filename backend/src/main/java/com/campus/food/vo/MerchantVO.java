package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * 商家信息VO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MerchantVO {

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 店铺地址
     */
    private String address;

    /**
     * 店铺描述
     */
    private String description;

    /**
     * 封面图URL
     */
    private String coverImage;

    /**
     * 坐标X
     */
    private BigDecimal coordinateX;

    /**
     * 坐标Y
     */
    private BigDecimal coordinateY;

    /**
     * 营业时间
     */
    private String openingHours;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 店铺状态
     */
    private String status;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 更新时间
     */
    private String updateTime;
}

