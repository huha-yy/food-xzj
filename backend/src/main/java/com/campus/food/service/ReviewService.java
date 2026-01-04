package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.CreateReviewDTO;
import com.campus.food.dto.ReviewAuditDTO;
import com.campus.food.dto.ReviewQueryDTO;
import com.campus.food.vo.ReviewVO;

/**
 * 评价服务接口
 */
public interface ReviewService {

    /**
     * 发表评价
     */
    Long createReview(CreateReviewDTO createReviewDTO, Long userId);

    /**
     * 删除评价
     */
    void deleteReview(Long reviewId, Long userId);

    /**
     * 查询评价详情
     */
    ReviewVO getReviewInfo(Long reviewId, Long currentUserId);

    /**
     * 评价列表查询
     */
    IPage<ReviewVO> getReviewList(ReviewQueryDTO reviewQueryDTO, Long currentUserId);

    /**
     * 评价审核
     */
    void auditReview(ReviewAuditDTO auditDTO);

    /**
     * 点赞
     */
    void likeReview(Long reviewId, Long userId);

    /**
     * 踩
     */
    void dislikeReview(Long reviewId, Long userId);

    /**
     * 取消点赞/踩
     */
    void cancelInteraction(Long reviewId, Long userId);
}

