package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateFoodDTO;
import com.campus.food.dto.FoodQueryDTO;
import com.campus.food.dto.UpdateFoodDTO;
import com.campus.food.service.FoodService;
import com.campus.food.vo.FoodVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static com.campus.food.common.result.Result.*;

/**
 * 菜品管理Controller
 */
@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@Tag(name = "菜品管理", description = "菜品相关接口")
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    @Operation(summary = "创建菜品")
    @PreAuthorize("hasRole('MERCHANT')")
    public Result<Long> createFood(
            @RequestBody CreateFoodDTO createFoodDTO,
            @AuthenticationPrincipal com.campus.food.security.SecurityUser securityUser
    ) {
        // TODO: 获取商家的merchantId
        createFoodDTO.setMerchantId(securityUser.getUserId());
        Long foodId = foodService.createFood(createFoodDTO);
        return Result.success(foodId);
    }

    @PutMapping("/{foodId}")
    @Operation(summary = "修改菜品")
    @PreAuthorize("hasRole('MERCHANT')")
    public Result<Void> updateFood(
            @PathVariable Long foodId,
            @RequestBody UpdateFoodDTO updateFoodDTO
    ) {
        foodService.updateFood(foodId, updateFoodDTO);
        return Result.success();
    }

    @DeleteMapping("/{foodId}")
    @Operation(summary = "删除菜品")
    @PreAuthorize("hasRole('MERCHANT')")
    public Result<Void> deleteFood(@PathVariable Long foodId) {
        foodService.deleteFood(foodId);
        return Result.success();
    }

    @GetMapping("/{foodId}")
    @Operation(summary = "查询菜品信息")
    public Result<FoodVO> getFoodInfo(@PathVariable Long foodId) {
        FoodVO foodVO = foodService.getFoodInfo(foodId);
        return success(foodVO);
    }

    @GetMapping("/list")
    @Operation(summary = "菜品列表查询")
    public Result<IPage<FoodVO>> getFoodList(FoodQueryDTO foodQueryDTO) {
        IPage<FoodVO> page = foodService.getFoodList(foodQueryDTO);
        return success(page);
    }

    @PutMapping("/{foodId}/status")
    @Operation(summary = "菜品上下架")
    @PreAuthorize("hasRole('MERCHANT')")
    public Result<Void> updateFoodStatus(
            @PathVariable Long foodId,
            @RequestParam String status
    ) {
        foodService.updateFoodStatus(foodId, status);
        return Result.success();
    }
}

