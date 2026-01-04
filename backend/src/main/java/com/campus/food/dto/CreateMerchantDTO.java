package com.campus.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建商家DTO
 */
@Data
public class CreateMerchantDTO {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 店铺名称
     */
    @NotBlank(message = "店铺名称不能为空")
    @Size(max = 64, message = "店铺名称长度不能超过64位")
    private String shopName;

    /**
     * 店铺地址
     */
    @Size(max = 256, message = "店铺地址长度不能超过256位")
    private String address;

    /**
     * 店铺描述
     */
    @Size(max = 1000, message = "店铺描述长度不能超过1000位")
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
    @Size(max = 64, message = "营业时间长度不能超过64位")
    private String openingHours;
}

