package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.food.dto.CreateCategoryDTO;
import com.campus.food.dto.UpdateCategoryDTO;
import com.campus.food.entity.Category;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.CategoryMapper;
import com.campus.food.service.CategoryService;
import com.campus.food.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 分类服务实现
 */
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createCategory(CreateCategoryDTO createCategoryDTO) {
        // 1. 检查分类名称是否已存在
        LambdaQueryWrapper<Category> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Category::getName, createCategoryDTO.getName());
        queryWrapper.eq(Category::getIsDeleted, 0);
        Category existCategory = categoryMapper.selectOne(queryWrapper);
        if (existCategory != null) {
            throw new BusinessException(4000, "分类名称已存在");
        }

        // 2. 创建分类实体
        Category category = new Category();
        category.setName(createCategoryDTO.getName());
        category.setDescription(createCategoryDTO.getDescription());
        category.setSort(createCategoryDTO.getSort() != null ? createCategoryDTO.getSort() : 0);
        category.setCreatorId(createCategoryDTO.getCreatorId());

        // 3. 插入数据库
        categoryMapper.insert(category);

        // 4. 返回分类ID
        return category.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateCategory(Long categoryId, UpdateCategoryDTO updateCategoryDTO) {
        // 1. 查询分类是否存在
        Category category = categoryMapper.selectById(categoryId);
        if (category == null || category.getIsDeleted() == 1) {
            throw new BusinessException(4000, "分类不存在");
        }

        // 2. 检查分类名称是否已存在（排除自己）
        if (updateCategoryDTO.getName() != null && !updateCategoryDTO.getName().equals(category.getName())) {
            LambdaQueryWrapper<Category> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Category::getName, updateCategoryDTO.getName());
            queryWrapper.eq(Category::getIsDeleted, 0);
            queryWrapper.ne(Category::getId, categoryId);
            Category existCategory = categoryMapper.selectOne(queryWrapper);
            if (existCategory != null) {
                throw new BusinessException(4000, "分类名称已存在");
            }
        }

        // 3. 更新分类信息
        if (updateCategoryDTO.getName() != null) {
            category.setName(updateCategoryDTO.getName());
        }
        if (updateCategoryDTO.getDescription() != null) {
            category.setDescription(updateCategoryDTO.getDescription());
        }
        if (updateCategoryDTO.getSort() != null) {
            category.setSort(updateCategoryDTO.getSort());
        }

        // 4. 更新数据库
        categoryMapper.updateById(category);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long categoryId) {
        // 1. 查询分类是否存在
        Category category = categoryMapper.selectById(categoryId);
        if (category == null || category.getIsDeleted() == 1) {
            throw new BusinessException(4000, "分类不存在");
        }

        // 2. 逻辑删除分类
        categoryMapper.deleteById(categoryId);
    }

    @Override
    public CategoryVO getCategoryInfo(Long categoryId) {
        // 1. 查询分类信息
        Category category = categoryMapper.selectById(categoryId);
        if (category == null || category.getIsDeleted() == 1) {
            throw new BusinessException(4000, "分类不存在");
        }

        // 2. 构建返回对象
        CategoryVO categoryVO = new CategoryVO();
        categoryVO.setCategoryId(category.getId());
        categoryVO.setName(category.getName());
        categoryVO.setDescription(category.getDescription());
        categoryVO.setSort(category.getSort());
        categoryVO.setCreateTime(category.getCreateTime().toString());
        categoryVO.setUpdateTime(category.getUpdateTime().toString());

        return categoryVO;
    }

    @Override
    public List<CategoryVO> getCategoryList() {
        // 1. 查询所有分类
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getIsDeleted, 0);
        wrapper.orderByAsc(Category::getSort);
        List<Category> categories = categoryMapper.selectList(wrapper);

        // 2. 转换为VO
        return categories.stream()
                .map(category -> {
                    CategoryVO categoryVO = new CategoryVO();
                    categoryVO.setCategoryId(category.getId());
                    categoryVO.setName(category.getName());
                    categoryVO.setDescription(category.getDescription());
                    categoryVO.setSort(category.getSort());
                    categoryVO.setCreateTime(category.getCreateTime().toString());
                    categoryVO.setUpdateTime(category.getUpdateTime().toString());
                    return categoryVO;
                })
                .collect(Collectors.toList());
    }
}

