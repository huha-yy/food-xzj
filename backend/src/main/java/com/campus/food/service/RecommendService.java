package com.campus.food.service;

import com.campus.food.vo.RecommendVO;

import java.util.List;

/**
 * 推荐服务接口
 */
public interface RecommendService {

    /**
     * 热度推荐（根据销量和评分推荐热门菜品）
     * @param limit 返回数量
     * @return 推荐菜品列表
     */
    List<RecommendVO> getHotRecommend(Integer limit);

    /**
     * 分类推荐（按分类推荐热门菜品）
     * @param categoryId 分类ID（如果为null，推荐所有分类）
     * @param limit 每个分类返回数量
     * @return 推荐菜品列表
     */
    List<RecommendVO> getCategoryRecommend(Long categoryId, Integer limit);
}

