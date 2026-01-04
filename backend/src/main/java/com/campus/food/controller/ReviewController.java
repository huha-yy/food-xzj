package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateReviewDTO;
import com.campus.food.dto.ReviewAuditDTO;
import com.campus.food.dto.ReviewQueryDTO;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.ReviewService;
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

    @DeleteMapping("/{reviewId}")
    @Operation(summary = "删除评价")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.deleteReview(reviewId, securityUser.getUserId());
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
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Void> likeReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.likeReview(reviewId, securityUser.getUserId());
        return Result.success();
    }

    @PostMapping("/{reviewId}/dislike")
    @Operation(summary = "踩")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Void> dislikeReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.dislikeReview(reviewId, securityUser.getUserId());
        return Result.success();
    }

    @DeleteMapping("/{reviewId}/interaction")
    @Operation(summary = "取消点赞/踩")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Void> cancelInteraction(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        reviewService.cancelInteraction(reviewId, securityUser.getUserId());
        return Result.success();
    }
}

