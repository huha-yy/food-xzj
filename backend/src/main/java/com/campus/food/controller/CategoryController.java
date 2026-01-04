package com.campus.food.controller;

import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateCategoryDTO;
import com.campus.food.dto.UpdateCategoryDTO;
import com.campus.food.service.CategoryService;
import com.campus.food.vo.CategoryVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.campus.food.common.result.Result.*;

/**
 * 分类管理Controller
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "分类管理", description = "分类相关接口")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "创建分类")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Long> createCategory(
            @RequestBody CreateCategoryDTO createCategoryDTO,
            @AuthenticationPrincipal com.campus.food.security.SecurityUser securityUser
    ) {
        createCategoryDTO.setCreatorId(securityUser.getUserId());
        Long categoryId = categoryService.createCategory(createCategoryDTO);
        return Result.success(categoryId);
    }

    @PutMapping("/{categoryId}")
    @Operation(summary = "修改分类")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody UpdateCategoryDTO updateCategoryDTO
    ) {
        categoryService.updateCategory(categoryId, updateCategoryDTO);
        return Result.success();
    }

    @DeleteMapping("/{categoryId}")
    @Operation(summary = "删除分类")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return Result.success();
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "查询分类信息")
    public Result<CategoryVO> getCategoryInfo(@PathVariable Long categoryId) {
        CategoryVO categoryVO = categoryService.getCategoryInfo(categoryId);
        return success(categoryVO);
    }

    @GetMapping("/list")
    @Operation(summary = "查询所有分类列表")
    public Result<List<CategoryVO>> getCategoryList() {
        List<CategoryVO> categoryList = categoryService.getCategoryList();
        return success(categoryList);
    }
}

