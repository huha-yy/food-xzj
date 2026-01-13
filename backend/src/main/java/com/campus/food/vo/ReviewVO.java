package com.campus.food.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * 评价信息VO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewVO {

    /**
     * 评价ID
     */
    private Long reviewId;

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
     * 菜品ID
     */
    private Long foodId;

    /**
     * 菜品名称
     */
    private String foodName;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 评分(1-5)
     */
    private Integer rating;

    /**
     * 评价内容
     */
    private String content;

    /**
     * 点赞数
     */
    private Integer likeCount;

    /**
     * 踩数
     */
    private Integer dislikeCount;

    /**
     * 评价图片列表
     */
    private List<String> imageUrls;

    /**
     * 审核状态
     */
    private String auditStatus;

    /**
     * 当前用户是否已点赞
     */
    private Boolean isLiked;

    /**
     * 当前用户是否已踩
     */
    private Boolean isDisliked;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 商家回复
     */
    private ReviewReplyVO reply;

    /**
     * 评价标签列表
     */
    private List<ReviewTagVO> tags;
}

