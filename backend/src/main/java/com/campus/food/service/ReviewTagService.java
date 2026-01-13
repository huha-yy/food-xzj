package com.campus.food.service;

import com.campus.food.vo.ReviewTagVO;

import java.util.List;

/**
 * 评价标签服务接口
 */
public interface ReviewTagService {

    /**
     * 获取所有标签列表
     */
    List<ReviewTagVO> getAllTags();

    /**
     * 根据评价ID获取标签列表
     */
    List<ReviewTagVO> getTagsByReviewId(Long reviewId);

    /**
     * 为评价添加标签
     */
    void addTagsToReview(Long reviewId, List<Long> tagIds);
}
