package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.CreateReviewDTO;
import com.campus.food.dto.ReviewAuditDTO;
import com.campus.food.dto.ReviewQueryDTO;
import com.campus.food.dto.UpdateReviewDTO;
import com.campus.food.vo.ReviewStatisticsVO;
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
     * 修改评价（仅作者本人，且仅限PENDING/REJECTED状态）
     */
    void updateReview(UpdateReviewDTO updateReviewDTO, Long userId);

    /**
     * 删除评价
     */
    void deleteReview(Long reviewId, Long userId, boolean isAdmin);

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

    /**
     * 获取评价统计数据
     */
    ReviewStatisticsVO getReviewStatistics();

    /**
     * 获取评分分布统计
     */
    com.campus.food.vo.RatingDistributionVO getRatingDistribution(Long foodId);
}

