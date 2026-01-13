package com.campus.food.controller;

import com.campus.food.common.result.Result;
import com.campus.food.service.ReviewTagService;
import com.campus.food.vo.ReviewTagVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 评价标签管理Controller
 */
@RestController
@RequestMapping("/api/review-tags")
@RequiredArgsConstructor
@Tag(name = "评价标签管理", description = "评价标签相关接口")
public class ReviewTagController {

    private final ReviewTagService reviewTagService;

    @GetMapping("/all")
    @Operation(summary = "获取所有标签列表")
    public Result<List<ReviewTagVO>> getAllTags() {
        List<ReviewTagVO> tags = reviewTagService.getAllTags();
        return Result.success(tags);
    }

    @GetMapping("/review/{reviewId}")
    @Operation(summary = "根据评价ID获取标签列表")
    public Result<List<ReviewTagVO>> getTagsByReviewId(@PathVariable Long reviewId) {
        List<ReviewTagVO> tags = reviewTagService.getTagsByReviewId(reviewId);
        return Result.success(tags);
    }
}
