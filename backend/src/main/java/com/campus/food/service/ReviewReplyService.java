package com.campus.food.service;

import com.campus.food.dto.CreateReviewReplyDTO;
import com.campus.food.vo.ReviewReplyVO;

/**
 * 评价回复服务接口
 */
public interface ReviewReplyService {

    /**
     * 创建商家回复
     */
    Long createReply(CreateReviewReplyDTO createReplyDTO, Long merchantId);

    /**
     * 删除商家回复
     */
    void deleteReply(Long replyId, Long merchantId);

    /**
     * 根据评价ID获取回复
     */
    ReviewReplyVO getReplyByReviewId(Long reviewId);
}
