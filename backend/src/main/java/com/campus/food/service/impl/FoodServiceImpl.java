package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.CreateFoodDTO;
import com.campus.food.dto.FoodQueryDTO;
import com.campus.food.dto.UpdateFoodDTO;
import com.campus.food.entity.Category;
import com.campus.food.entity.Food;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.CategoryMapper;
import com.campus.food.mapper.FoodMapper;
import com.campus.food.service.FoodService;
import com.campus.food.vo.FoodVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 菜品服务实现
 */
@Service
@RequiredArgsConstructor
public class FoodServiceImpl extends ServiceImpl<FoodMapper, Food> implements FoodService {

    private final FoodMapper foodMapper;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createFood(CreateFoodDTO createFoodDTO) {
        // 1. 检查商家是否存在
        // 这里可以添加商家检查逻辑，暂时跳过

        // 2. 检查分类是否存在
        Category category = categoryMapper.selectById(createFoodDTO.getCategoryId());
        if (category == null || category.getIsDeleted() == 1) {
            throw new BusinessException(4000, "分类不存在");
        }

        // 3. 创建菜品实体
        Food food = new Food();
        food.setMerchantId(createFoodDTO.getMerchantId());
        food.setCategoryId(createFoodDTO.getCategoryId());
        food.setName(createFoodDTO.getName());
        food.setPrice(createFoodDTO.getPrice());
        food.setDescription(createFoodDTO.getDescription());
        food.setImageUrl(createFoodDTO.getImageUrl());
        food.setSalesCount(0);
        food.setRatingAvg(java.math.BigDecimal.ZERO);
        food.setStatus("ON_SHELF");

        // 4. 插入数据库
        foodMapper.insert(food);

        // 5. 返回菜品ID
        return food.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateFood(Long foodId, UpdateFoodDTO updateFoodDTO) {
        // 1. 查询菜品是否存在
        Food food = foodMapper.selectById(foodId);
        if (food == null || food.getIsDeleted() == 1) {
            throw new BusinessException(4000, "菜品不存在");
        }

        // 2. 检查分类是否存在（如果修改了分类）
        if (updateFoodDTO.getCategoryId() != null && !updateFoodDTO.getCategoryId().equals(food.getCategoryId())) {
            Category category = categoryMapper.selectById(updateFoodDTO.getCategoryId());
            if (category == null || category.getIsDeleted() == 1) {
                throw new BusinessException(4000, "分类不存在");
            }
        }

        // 3. 更新菜品信息
        if (updateFoodDTO.getCategoryId() != null) {
            food.setCategoryId(updateFoodDTO.getCategoryId());
        }
        if (updateFoodDTO.getName() != null) {
            food.setName(updateFoodDTO.getName());
        }
        if (updateFoodDTO.getPrice() != null) {
            food.setPrice(updateFoodDTO.getPrice());
        }
        if (updateFoodDTO.getDescription() != null) {
            food.setDescription(updateFoodDTO.getDescription());
        }
        if (updateFoodDTO.getImageUrl() != null) {
            food.setImageUrl(updateFoodDTO.getImageUrl());
        }

        // 4. 更新数据库
        foodMapper.updateById(food);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteFood(Long foodId) {
        // 1. 查询菜品是否存在
        Food food = foodMapper.selectById(foodId);
        if (food == null || food.getIsDeleted() == 1) {
            throw new BusinessException(4000, "菜品不存在");
        }

        // 2. 逻辑删除菜品
        foodMapper.deleteById(foodId);
    }

    @Override
    public FoodVO getFoodInfo(Long foodId) {
        // 1. 查询菜品信息
        Food food = foodMapper.selectById(foodId);
        if (food == null || food.getIsDeleted() == 1) {
            throw new BusinessException(4000, "菜品不存在");
        }

        // 2. 查询分类名称
        Category category = categoryMapper.selectById(food.getCategoryId());
        String categoryName = category != null ? category.getName() : "";

        // 3. 构建返回对象
        FoodVO foodVO = new FoodVO();
        foodVO.setFoodId(food.getId());
        foodVO.setMerchantId(food.getMerchantId());
        foodVO.setCategoryId(food.getCategoryId());
        foodVO.setCategoryName(categoryName);
        foodVO.setName(food.getName());
        foodVO.setPrice(food.getPrice());
        foodVO.setDescription(food.getDescription());
        foodVO.setImageUrl(food.getImageUrl());
        foodVO.setSalesCount(food.getSalesCount());
        foodVO.setRatingAvg(food.getRatingAvg());
        foodVO.setStatus(food.getStatus());
        foodVO.setCreateTime(food.getCreateTime().toString());
        foodVO.setUpdateTime(food.getUpdateTime().toString());

        return foodVO;
    }

    @Override
    public IPage<FoodVO> getFoodList(FoodQueryDTO foodQueryDTO) {
        // 1. 构建分页对象
        Page<Food> page = new Page<>(foodQueryDTO.getCurrent(), foodQueryDTO.getPageSize());

        // 2. 构建查询条件
        LambdaQueryWrapper<Food> wrapper = new LambdaQueryWrapper<>();

        // 3. 按菜品名称模糊查询
        if (foodQueryDTO.getKeyword() != null && !foodQueryDTO.getKeyword().isEmpty()) {
            wrapper.like(Food::getName, foodQueryDTO.getKeyword());
        }

        // 4. 按商家ID筛选
        if (foodQueryDTO.getMerchantId() != null) {
            wrapper.eq(Food::getMerchantId, foodQueryDTO.getMerchantId());
        }

        // 5. 按分类ID筛选
        if (foodQueryDTO.getCategoryId() != null) {
            wrapper.eq(Food::getCategoryId, foodQueryDTO.getCategoryId());
        }

        // 6. 按状态筛选
        if (foodQueryDTO.getStatus() != null && !foodQueryDTO.getStatus().isEmpty()) {
            wrapper.eq(Food::getStatus, foodQueryDTO.getStatus());
        }

        // 7. 排序：按销量倒序
        wrapper.orderByDesc(Food::getSalesCount);

        // 8. 查询
        IPage<Food> resultPage = foodMapper.selectPage(page, wrapper);

        // 9. 获取所有分类ID
        List<Long> categoryIds = resultPage.getRecords().stream()
                .map(Food::getCategoryId)
                .distinct()
                .collect(Collectors.toList());

        // 10. 批量查询分类
        Map<Long, String> categoryMap = categoryIds.isEmpty() ? Map.of() :
            categoryMapper.selectBatchIds(categoryIds).stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        // 11. 转换为VO
        return resultPage.convert(foodItem -> {
            FoodVO foodVO = new FoodVO();
            foodVO.setFoodId(foodItem.getId());
            foodVO.setMerchantId(foodItem.getMerchantId());
            foodVO.setCategoryId(foodItem.getCategoryId());
            foodVO.setCategoryName(categoryMap.getOrDefault(foodItem.getCategoryId(), ""));
            foodVO.setName(foodItem.getName());
            foodVO.setPrice(foodItem.getPrice());
            foodVO.setDescription(foodItem.getDescription());
            foodVO.setImageUrl(foodItem.getImageUrl());
            foodVO.setSalesCount(foodItem.getSalesCount());
            foodVO.setRatingAvg(foodItem.getRatingAvg());
            foodVO.setStatus(foodItem.getStatus());
            foodVO.setCreateTime(foodItem.getCreateTime().toString());
            foodVO.setUpdateTime(foodItem.getUpdateTime().toString());
            return foodVO;
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateFoodStatus(Long foodId, String status) {
        // 1. 查询菜品
        Food food = foodMapper.selectById(foodId);
        if (food == null || food.getIsDeleted() == 1) {
            throw new BusinessException(4000, "菜品不存在");
        }

        // 2. 校验状态值
        if (!"ON_SHELF".equals(status) && !"OFF_SHELF".equals(status)) {
            throw new BusinessException(4000, "状态值不正确");
        }

        // 3. 更新状态
        food.setStatus(status);
        foodMapper.updateById(food);
    }
}
