package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.CreateCategoryDTO;
import com.campus.food.dto.UpdateCategoryDTO;
import com.campus.food.vo.CategoryVO;

import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService {

    /**
     * 创建分类
     */
    Long createCategory(CreateCategoryDTO createCategoryDTO);

    /**
     * 修改分类
     */
    void updateCategory(Long categoryId, UpdateCategoryDTO updateCategoryDTO);

    /**
     * 删除分类
     */
    void deleteCategory(Long categoryId);

    /**
     * 查询分类信息
     */
    CategoryVO getCategoryInfo(Long categoryId);

    /**
     * 查询所有分类列表
     */
    List<CategoryVO> getCategoryList();
}

