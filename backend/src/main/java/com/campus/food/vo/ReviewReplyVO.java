package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 评价回复VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReplyVO {

    /**
     * 回复ID
     */
    private Long replyId;

    /**
     * 评价ID
     */
    private Long reviewId;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 回复内容
     */
    private String content;

    /**
     * 创建时间
     */
    private String createTime;
}
