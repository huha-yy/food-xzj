package com.campus.food.controller;

import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateReviewReplyDTO;
import com.campus.food.entity.Merchant;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.ReviewReplyService;
import com.campus.food.vo.ReviewReplyVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 评价回复管理Controller
 */
@RestController
@RequestMapping("/api/review-replies")
@RequiredArgsConstructor
@Tag(name = "评价回复管理", description = "商家回复评价相关接口")
public class ReviewReplyController {

    private final ReviewReplyService reviewReplyService;
    private final MerchantMapper merchantMapper;

    @PostMapping
    @Operation(summary = "创建商家回复")
    @PreAuthorize("hasRole('MERCHANT')")
    public Result<Long> createReply(
            @RequestBody CreateReviewReplyDTO createReplyDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        // 获取商家ID
        Merchant merchant = merchantMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Merchant>()
                        .eq(Merchant::getUserId, securityUser.getUserId())
        );
        if (merchant == null) {
            return Result.error(4000, "商家信息不存在");
        }

        Long replyId = reviewReplyService.createReply(createReplyDTO, merchant.getId());
        return Result.success(replyId);
    }

    @DeleteMapping("/{replyId}")
    @Operation(summary = "删除商家回复")
    @PreAuthorize("hasRole('MERCHANT')")
    public Result<Void> deleteReply(
            @PathVariable Long replyId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        // 获取商家ID
        Merchant merchant = merchantMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Merchant>()
                        .eq(Merchant::getUserId, securityUser.getUserId())
        );
        if (merchant == null) {
            return Result.error(4000, "商家信息不存在");
        }

        reviewReplyService.deleteReply(replyId, merchant.getId());
        return Result.success();
    }

    @GetMapping("/review/{reviewId}")
    @Operation(summary = "根据评价ID获取回复")
    public Result<ReviewReplyVO> getReplyByReviewId(@PathVariable Long reviewId) {
        ReviewReplyVO reply = reviewReplyService.getReplyByReviewId(reviewId);
        return Result.success(reply);
    }
}
