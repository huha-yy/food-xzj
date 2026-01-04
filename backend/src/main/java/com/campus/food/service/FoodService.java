package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.CreateFoodDTO;
import com.campus.food.dto.FoodQueryDTO;
import com.campus.food.dto.UpdateFoodDTO;
import com.campus.food.vo.FoodVO;

/**
 * 菜品服务接口
 */
public interface FoodService {

    /**
     * 创建菜品
     */
    Long createFood(CreateFoodDTO createFoodDTO);

    /**
     * 修改菜品
     */
    void updateFood(Long foodId, UpdateFoodDTO updateFoodDTO);

    /**
     * 删除菜品（逻辑删除）
     */
    void deleteFood(Long foodId);

    /**
     * 查询菜品信息
     */
    FoodVO getFoodInfo(Long foodId);

    /**
     * 菜品列表查询
     */
    IPage<FoodVO> getFoodList(FoodQueryDTO foodQueryDTO);

    /**
     * 菜品上下架
     */
    void updateFoodStatus(Long foodId, String status);
}

