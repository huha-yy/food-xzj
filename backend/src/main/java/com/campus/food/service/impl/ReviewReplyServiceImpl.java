package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.CreateReviewReplyDTO;
import com.campus.food.entity.Merchant;
import com.campus.food.entity.Review;
import com.campus.food.entity.ReviewReply;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.mapper.ReviewMapper;
import com.campus.food.mapper.ReviewReplyMapper;
import com.campus.food.service.ReviewReplyService;
import com.campus.food.vo.ReviewReplyVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

/**
 * 评价回复服务实现
 */
@Service
@RequiredArgsConstructor
public class ReviewReplyServiceImpl extends ServiceImpl<ReviewReplyMapper, ReviewReply> implements ReviewReplyService {

    private final ReviewReplyMapper reviewReplyMapper;
    private final ReviewMapper reviewMapper;
    private final MerchantMapper merchantMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createReply(CreateReviewReplyDTO createReplyDTO, Long merchantId) {
        // 1. 检查评价是否存在
        Review review = reviewMapper.selectById(createReplyDTO.getReviewId());
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 检查是否为该评价对应的商家
        if (!review.getMerchantId().equals(merchantId)) {
            throw new BusinessException(4000, "只能回复自己店铺的评价");
        }

        // 3. 检查是否已经回复过
        LambdaQueryWrapper<ReviewReply> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ReviewReply::getReviewId, createReplyDTO.getReviewId());
        wrapper.eq(ReviewReply::getMerchantId, merchantId);
        ReviewReply existingReply = reviewReplyMapper.selectOne(wrapper);
        if (existingReply != null) {
            throw new BusinessException(4000, "已经回复过该评价，请勿重复回复");
        }

        // 4. 创建回复
        ReviewReply reply = new ReviewReply();
        reply.setReviewId(createReplyDTO.getReviewId());
        reply.setMerchantId(merchantId);
        reply.setContent(createReplyDTO.getContent());
        reviewReplyMapper.insert(reply);

        return reply.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteReply(Long replyId, Long merchantId) {
        // 1. 查询回复是否存在
        ReviewReply reply = reviewReplyMapper.selectById(replyId);
        if (reply == null || reply.getIsDeleted() == 1) {
            throw new BusinessException(4000, "回复不存在");
        }

        // 2. 检查是否为回复的商家
        if (!reply.getMerchantId().equals(merchantId)) {
            throw new BusinessException(4000, "只能删除自己的回复");
        }

        // 3. 删除回复
        reviewReplyMapper.deleteById(replyId);
    }

    @Override
    public ReviewReplyVO getReplyByReviewId(Long reviewId) {
        // 查询回复
        LambdaQueryWrapper<ReviewReply> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ReviewReply::getReviewId, reviewId);
        ReviewReply reply = reviewReplyMapper.selectOne(wrapper);

        if (reply == null) {
            return null;
        }

        // 查询商家信息
        Merchant merchant = merchantMapper.selectById(reply.getMerchantId());

        // 构建返回对象
        return ReviewReplyVO.builder()
                .replyId(reply.getId())
                .reviewId(reply.getReviewId())
                .merchantId(reply.getMerchantId())
                .shopName(merchant != null ? merchant.getShopName() : "未知商家")
                .content(reply.getContent())
                .createTime(reply.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();
    }
}
