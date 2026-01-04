package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.food.entity.Category;
import com.campus.food.entity.Food;
import com.campus.food.entity.Merchant;
import com.campus.food.mapper.CategoryMapper;
import com.campus.food.mapper.FoodMapper;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.service.RecommendService;
import com.campus.food.vo.RecommendVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 推荐服务实现
 */
@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {

    private final FoodMapper foodMapper;
    private final MerchantMapper merchantMapper;
    private final CategoryMapper categoryMapper;

    @Override
    public List<RecommendVO> getHotRecommend(Integer limit) {
        // 1. 设置默认限制数量
        int defaultLimit = limit != null && limit > 0 ? Math.min(limit, 50) : 10;

        // 2. 查询所有上架的菜品
        LambdaQueryWrapper<Food> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Food::getStatus, "ONLINE");
        wrapper.orderByDesc(Food::getSalesCount);
        wrapper.last("LIMIT " + defaultLimit);
        List<Food> foodList = foodMapper.selectList(wrapper);

        // 3. 计算热度分并排序
        List<RecommendVO> recommendList = foodList.stream()
                .map(food -> {
                    // 计算热度分：销量 * 0.7 + 评分 * 10 * 0.3
                    double salesScore = food.getSalesCount() != null ? food.getSalesCount() : 0;
                    double ratingScore = food.getRatingAvg() != null ? food.getRatingAvg().doubleValue() * 10 : 0;
                    double hotScore = salesScore * 0.7 + ratingScore * 0.3;

                    return RecommendVO.builder()
                            .id(food.getId())
                            .merchantId(food.getMerchantId())
                            .categoryId(food.getCategoryId())
                            .name(food.getName())
                            .price(food.getPrice())
                            .description(food.getDescription())
                            .imageUrl(food.getImageUrl())
                            .salesCount(food.getSalesCount())
                            .ratingAvg(food.getRatingAvg())
                            .hotScore(hotScore)
                            .build();
                })
                .sorted(Comparator.comparing(RecommendVO::getHotScore).reversed())
                .collect(Collectors.toList());

        // 4. 批量查询商家和分类信息
        List<Long> merchantIds = recommendList.stream()
                .map(RecommendVO::getMerchantId).distinct().collect(Collectors.toList());
        List<Long> categoryIds = recommendList.stream()
                .map(RecommendVO::getCategoryId).distinct().collect(Collectors.toList());

        Map<Long, String> merchantNameMap = merchantIds.isEmpty() ? Map.of() :
                merchantMapper.selectBatchIds(merchantIds).stream()
                        .collect(Collectors.toMap(Merchant::getId, Merchant::getShopName));
        Map<Long, String> categoryNameMap = categoryIds.isEmpty() ? Map.of() :
                categoryMapper.selectBatchIds(categoryIds).stream()
                        .collect(Collectors.toMap(Category::getId, Category::getName));

        // 5. 填充商家和分类信息
        recommendList.forEach(vo -> {
            vo.setMerchantName(merchantNameMap.getOrDefault(vo.getMerchantId(), ""));
            vo.setCategoryName(categoryNameMap.getOrDefault(vo.getCategoryId(), ""));
        });

        return recommendList;
    }

    @Override
    public List<RecommendVO> getCategoryRecommend(Long categoryId, Integer limit) {
        // 1. 设置默认限制数量
        int defaultLimit = limit != null && limit > 0 ? Math.min(limit, 20) : 10;

        // 2. 如果指定了分类ID，只查询该分类的菜品
        // 否则查询所有分类的菜品（每个分类返回指定数量）
        LambdaQueryWrapper<Food> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Food::getStatus, "ONLINE");

        if (categoryId != null) {
            // 查询指定分类的菜品
            wrapper.eq(Food::getCategoryId, categoryId);
            wrapper.orderByDesc(Food::getSalesCount);
            wrapper.last("LIMIT " + defaultLimit);
            List<Food> foodList = foodMapper.selectList(wrapper);

            // 计算热度分
            List<RecommendVO> recommendList = foodList.stream()
                    .map(food -> {
                        double salesScore = food.getSalesCount() != null ? food.getSalesCount() : 0;
                        double ratingScore = food.getRatingAvg() != null ? food.getRatingAvg().doubleValue() * 10 : 0;
                        double hotScore = salesScore * 0.7 + ratingScore * 0.3;

                        return RecommendVO.builder()
                                .id(food.getId())
                                .merchantId(food.getMerchantId())
                                .categoryId(food.getCategoryId())
                                .name(food.getName())
                                .price(food.getPrice())
                                .description(food.getDescription())
                                .imageUrl(food.getImageUrl())
                                .salesCount(food.getSalesCount())
                                .ratingAvg(food.getRatingAvg())
                                .hotScore(hotScore)
                                .build();
                    })
                    .sorted(Comparator.comparing(RecommendVO::getHotScore).reversed())
                    .collect(Collectors.toList());

            // 批量查询商家和分类信息
            List<Long> merchantIds = recommendList.stream()
                    .map(RecommendVO::getMerchantId).distinct().collect(Collectors.toList());

            Map<Long, String> merchantNameMap = merchantIds.isEmpty() ? Map.of() :
                    merchantMapper.selectBatchIds(merchantIds).stream()
                            .collect(Collectors.toMap(Merchant::getId, Merchant::getShopName));
            Category category = categoryMapper.selectById(categoryId);

            // 填充商家和分类信息
            recommendList.forEach(vo -> {
                vo.setMerchantName(merchantNameMap.getOrDefault(vo.getMerchantId(), ""));
                vo.setCategoryName(category != null ? category.getName() : "");
            });

            return recommendList;

        } else {
            // 查询所有分类
            LambdaQueryWrapper<Category> categoryWrapper = new LambdaQueryWrapper<>();
            List<Category> categoryList = categoryMapper.selectList(categoryWrapper);

            // 为每个分类查询推荐菜品
            List<RecommendVO> allRecommendList = categoryList.stream()
                    .flatMap(category -> {
                        LambdaQueryWrapper<Food> foodWrapper = new LambdaQueryWrapper<>();
                        foodWrapper.eq(Food::getStatus, "ONLINE");
                        foodWrapper.eq(Food::getCategoryId, category.getId());
                        foodWrapper.orderByDesc(Food::getSalesCount);
                        foodWrapper.last("LIMIT " + defaultLimit);
                        List<Food> foodList = foodMapper.selectList(foodWrapper);

                        return foodList.stream()
                                .map(food -> {
                                    double salesScore = food.getSalesCount() != null ? food.getSalesCount() : 0;
                                    double ratingScore = food.getRatingAvg() != null ? food.getRatingAvg().doubleValue() * 10 : 0;
                                    double hotScore = salesScore * 0.7 + ratingScore * 0.3;

                                    return RecommendVO.builder()
                                            .id(food.getId())
                                            .merchantId(food.getMerchantId())
                                            .categoryId(food.getCategoryId())
                                            .name(food.getName())
                                            .price(food.getPrice())
                                            .description(food.getDescription())
                                            .imageUrl(food.getImageUrl())
                                            .salesCount(food.getSalesCount())
                                            .ratingAvg(food.getRatingAvg())
                                            .hotScore(hotScore)
                                            .merchantName("") // 稍后填充
                                            .categoryName(category.getName())
                                            .build();
                                });
                    })
                    .collect(Collectors.toList());

            // 批量查询所有商家信息
            List<Long> allMerchantIds = allRecommendList.stream()
                    .map(RecommendVO::getMerchantId).distinct().collect(Collectors.toList());
            Map<Long, String> merchantNameMap = allMerchantIds.isEmpty() ? Map.of() :
                    merchantMapper.selectBatchIds(allMerchantIds).stream()
                            .collect(Collectors.toMap(Merchant::getId, Merchant::getShopName));

            // 填充商家信息
            allRecommendList.forEach(vo -> {
                vo.setMerchantName(merchantNameMap.getOrDefault(vo.getMerchantId(), ""));
            });

            // 按热度分排序
            return allRecommendList.stream()
                    .sorted(Comparator.comparing(RecommendVO::getHotScore).reversed())
                    .collect(Collectors.toList());
        }
    }
}

