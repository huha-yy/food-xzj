package com.campus.food.controller;

import com.campus.food.common.result.Result;
import com.campus.food.service.RecommendService;
import com.campus.food.vo.RecommendVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 推荐管理控制器
 */
@Tag(name = "推荐管理", description = "推荐相关接口")
@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @Operation(summary = "热度推荐")
    @GetMapping("/hot")
    public Result<List<RecommendVO>> getHotRecommend(
            @RequestParam(required = false) Integer limit) {
        List<RecommendVO> recommendList = recommendService.getHotRecommend(limit);
        return Result.success(recommendList);
    }

    @Operation(summary = "分类推荐")
    @GetMapping("/category")
    public Result<List<RecommendVO>> getCategoryRecommend(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer limit) {
        List<RecommendVO> recommendList = recommendService.getCategoryRecommend(categoryId, limit);
        return Result.success(recommendList);
    }
}

