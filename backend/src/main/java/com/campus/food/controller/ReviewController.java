package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateReviewDTO;
import com.campus.food.dto.ReviewAuditDTO;
import com.campus.food.dto.ReviewQueryDTO;
import com.campus.food.dto.UpdateReviewDTO;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.ReviewService;
import com.campus.food.vo.ReviewStatisticsVO;
import com.campus.food.vo.ReviewVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 评价管理Controller
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "评价管理", description = "评价相关接口")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "发表评价")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Long> createReview(
            @RequestBody CreateReviewDTO createReviewDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        Long reviewId = reviewService.createReview(createReviewDTO, securityUser.getUserId());
        return Result.success(reviewId);
    }

    @PutMapping
    @Operation(summary = "修改评价")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Void> updateReview(
            @RequestBody UpdateReviewDTO updateReviewDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.updateReview(updateReviewDTO, securityUser.getUserId());
        return Result.success();
    }

    @DeleteMapping("/{reviewId}")
    @Operation(summary = "删除评价")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public Result<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.deleteReview(reviewId, securityUser.getUserId(), securityUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        return Result.success();
    }

    @GetMapping("/{reviewId}")
    @Operation(summary = "查询评价详情")
    public Result<ReviewVO> getReviewInfo(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        Long currentUserId = securityUser != null ? securityUser.getUserId() : null;
        ReviewVO reviewVO = reviewService.getReviewInfo(reviewId, currentUserId);
        return Result.success(reviewVO);
    }

    @GetMapping("/list")
    @Operation(summary = "评价列表查询")
    public Result<IPage<ReviewVO>> getReviewList(
            ReviewQueryDTO reviewQueryDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        Long currentUserId = securityUser != null ? securityUser.getUserId() : null;
        IPage<ReviewVO> page = reviewService.getReviewList(reviewQueryDTO, currentUserId);
        return Result.success(page);
    }

    @PostMapping("/audit")
    @Operation(summary = "评价审核")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> auditReview(@RequestBody ReviewAuditDTO auditDTO) {
        reviewService.auditReview(auditDTO);
        return Result.success();
    }

    @PostMapping("/{reviewId}/like")
    @Operation(summary = "点赞")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> likeReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.likeReview(reviewId, securityUser.getUserId());
        return Result.success();
    }

    @PostMapping("/{reviewId}/dislike")
    @Operation(summary = "踩")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> dislikeReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.dislikeReview(reviewId, securityUser.getUserId());
        return Result.success();
    }

    @DeleteMapping("/{reviewId}/interaction")
    @Operation(summary = "取消点赞/踩")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> cancelInteraction(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.cancelInteraction(reviewId, securityUser.getUserId());
        return Result.success();
    }

    @GetMapping("/statistics")
    @Operation(summary = "获取评价统计数据")
    public Result<ReviewStatisticsVO> getReviewStatistics() {
        ReviewStatisticsVO statistics = reviewService.getReviewStatistics();
        return Result.success(statistics);
    }

    @GetMapping("/rating-distribution")
    @Operation(summary = "获取评分分布统计")
    public Result<com.campus.food.vo.RatingDistributionVO> getRatingDistribution(
            @RequestParam(required = false) Long foodId
    ) {
        com.campus.food.vo.RatingDistributionVO distribution = reviewService.getRatingDistribution(foodId);
        return Result.success(distribution);
    }
}

