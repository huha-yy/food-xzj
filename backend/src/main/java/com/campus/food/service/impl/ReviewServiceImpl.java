package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.CreateReviewDTO;
import com.campus.food.dto.ReviewAuditDTO;
import com.campus.food.dto.ReviewQueryDTO;
import com.campus.food.entity.*;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.*;
import com.campus.food.service.ReviewService;
import com.campus.food.vo.ReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 评价服务实现
 */
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl extends ServiceImpl<ReviewMapper, Review> implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final ReviewImageMapper reviewImageMapper;
    private final InteractionMapper interactionMapper;
    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final FoodMapper foodMapper;
    private final MerchantMapper merchantMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createReview(CreateReviewDTO createReviewDTO, Long userId) {
        // 1. 检查菜品是否存在
        Food food = foodMapper.selectById(createReviewDTO.getFoodId());
        if (food == null || food.getIsDeleted() == 1) {
            throw new BusinessException(4000, "菜品不存在");
        }

        // 2. 创建评价实体
        Review review = new Review();
        review.setUserId(userId);
        review.setFoodId(createReviewDTO.getFoodId());
        review.setMerchantId(food.getMerchantId());
        review.setRating(createReviewDTO.getRating());
        review.setContent(createReviewDTO.getContent());
        review.setLikeCount(0);
        review.setDislikeCount(0);
        review.setAuditStatus("PENDING");
        reviewMapper.insert(review);

        // 3. 保存评价图片
        if (createReviewDTO.getImageUrls() != null && !createReviewDTO.getImageUrls().isEmpty()) {
            for (int i = 0; i < createReviewDTO.getImageUrls().size(); i++) {
                ReviewImage reviewImage = new ReviewImage();
                reviewImage.setReviewId(review.getId());
                reviewImage.setImageUrl(createReviewDTO.getImageUrls().get(i));
                reviewImage.setSort(i);
                reviewImageMapper.insert(reviewImage);
            }
        }

        // 4. 返回评价ID
        return review.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteReview(Long reviewId, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 检查是否为评价作者
        if (!review.getUserId().equals(userId)) {
            throw new BusinessException(4000, "只能删除自己的评价");
        }

        // 3. 逻辑删除评价
        reviewMapper.deleteById(reviewId);

        // 4. 删除相关互动
        LambdaQueryWrapper<Interaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Interaction::getReviewId, reviewId);
        interactionMapper.delete(wrapper);

        // 5. 删除评价图片
        LambdaQueryWrapper<ReviewImage> imageWrapper = new LambdaQueryWrapper<>();
        imageWrapper.eq(ReviewImage::getReviewId, reviewId);
        reviewImageMapper.delete(imageWrapper);
    }

    @Override
    public ReviewVO getReviewInfo(Long reviewId, Long currentUserId) {
        // 1. 查询评价信息
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 查询用户信息
        User user = userMapper.selectById(review.getUserId());
        UserProfile userProfile = user != null ?
                userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>()
                        .eq(UserProfile::getUserId, review.getUserId())) : null;

        // 3. 查询菜品信息
        Food food = foodMapper.selectById(review.getFoodId());

        // 4. 查询商家信息
        Merchant merchant = merchantMapper.selectById(review.getMerchantId());

        // 5. 查询评价图片
        LambdaQueryWrapper<ReviewImage> imageWrapper = new LambdaQueryWrapper<>();
        imageWrapper.eq(ReviewImage::getReviewId, reviewId);
        imageWrapper.orderByAsc(ReviewImage::getSort);
        List<ReviewImage> reviewImages = reviewImageMapper.selectList(imageWrapper);

        // 6. 查询当前用户是否已点赞/踩
        Boolean isLiked = false;
        Boolean isDisliked = false;
        if (currentUserId != null) {
            LambdaQueryWrapper<Interaction> interactionWrapper = new LambdaQueryWrapper<>();
            interactionWrapper.eq(Interaction::getUserId, currentUserId);
            interactionWrapper.eq(Interaction::getReviewId, reviewId);
            Interaction interaction = interactionMapper.selectOne(interactionWrapper);
            if (interaction != null) {
                if ("LIKE".equals(interaction.getType())) {
                    isLiked = true;
                } else if ("DISLIKE".equals(interaction.getType())) {
                    isDisliked = true;
                }
            }
        }

        // 7. 构建返回对象
        ReviewVO reviewVO = ReviewVO.builder()
                .reviewId(review.getId())
                .userId(review.getUserId())
                .username(user != null ? user.getUsername() : "")
                .avatar(userProfile != null ? userProfile.getAvatar() : "")
                .foodId(review.getFoodId())
                .foodName(food != null ? food.getName() : "")
                .merchantId(review.getMerchantId())
                .shopName(merchant != null ? merchant.getShopName() : "")
                .rating(review.getRating())
                .content(review.getContent())
                .likeCount(review.getLikeCount())
                .dislikeCount(review.getDislikeCount())
                .imageUrls(reviewImages.stream().map(ReviewImage::getImageUrl).collect(Collectors.toList()))
                .auditStatus(review.getAuditStatus())
                .isLiked(isLiked)
                .isDisliked(isDisliked)
                .createTime(review.getCreateTime().toString())
                .build();

        return reviewVO;
    }

    @Override
    public IPage<ReviewVO> getReviewList(ReviewQueryDTO reviewQueryDTO, Long currentUserId) {
        // 1. 构建分页对象
        Page<Review> page = new Page<>(reviewQueryDTO.getCurrent(), reviewQueryDTO.getPageSize());

        // 2. 构建查询条件
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();

        // 3. 按菜品ID筛选
        if (reviewQueryDTO.getFoodId() != null) {
            wrapper.eq(Review::getFoodId, reviewQueryDTO.getFoodId());
        }

        // 4. 按商家ID筛选
        if (reviewQueryDTO.getMerchantId() != null) {
            wrapper.eq(Review::getMerchantId, reviewQueryDTO.getMerchantId());
        }

        // 5. 按用户ID筛选
        if (reviewQueryDTO.getUserId() != null) {
            wrapper.eq(Review::getUserId, reviewQueryDTO.getUserId());
        }

        // 6. 按审核状态筛选
        if (reviewQueryDTO.getAuditStatus() != null) {
            wrapper.eq(Review::getAuditStatus, reviewQueryDTO.getAuditStatus());
        }

        // 7. 排序：按创建时间倒序
        wrapper.orderByDesc(Review::getCreateTime);

        // 8. 查询
        IPage<Review> resultPage = reviewMapper.selectPage(page, wrapper);

        // 9. 获取所有相关ID
        List<Long> userIds = resultPage.getRecords().stream()
                .map(Review::getUserId).distinct().collect(Collectors.toList());
        List<Long> foodIds = resultPage.getRecords().stream()
                .map(Review::getFoodId).distinct().collect(Collectors.toList());
        List<Long> merchantIds = resultPage.getRecords().stream()
                .map(Review::getMerchantId).distinct().collect(Collectors.toList());

        // 10. 批量查询
        Map<Long, String> usernameMap = userIds.isEmpty() ? Map.of() :
                userMapper.selectBatchIds(userIds).stream()
                        .collect(Collectors.toMap(
                                User::getId,
                                user -> user.getUsername() != null ? user.getUsername() : "",
                                (v1, v2) -> v1
                        ));
        Map<Long, String> avatarMap = userIds.isEmpty() ? Map.of() :
                userProfileMapper.selectList(new LambdaQueryWrapper<UserProfile>()
                                .in(UserProfile::getUserId, userIds)).stream()
                        .collect(Collectors.toMap(
                                UserProfile::getUserId,
                                profile -> profile.getAvatar() != null ? profile.getAvatar() : "",
                                (v1, v2) -> v1
                        ));
        Map<Long, String> foodNameMap = foodIds.isEmpty() ? Map.of() :
                foodMapper.selectBatchIds(foodIds).stream()
                        .collect(Collectors.toMap(
                                Food::getId,
                                food -> food.getName() != null ? food.getName() : "",
                                (v1, v2) -> v1
                        ));
        Map<Long, String> shopNameMap = merchantIds.isEmpty() ? Map.of() :
                merchantMapper.selectBatchIds(merchantIds).stream()
                        .collect(Collectors.toMap(
                                Merchant::getId,
                                merchant -> merchant.getShopName() != null ? merchant.getShopName() : "",
                                (v1, v2) -> v1
                        ));

        // 11. 查询所有评价图片
        List<Long> reviewIds = resultPage.getRecords().stream()
                .map(Review::getId).collect(Collectors.toList());
        Map<Long, List<ReviewImage>> imageMap = reviewIds.isEmpty() ? Map.of() :
                reviewImageMapper.selectList(new LambdaQueryWrapper<ReviewImage>()
                                .in(ReviewImage::getReviewId, reviewIds))
                        .stream()
                        .collect(Collectors.groupingBy(ReviewImage::getReviewId));

        // 12. 查询当前用户的点赞/踩状态
        Map<Long, Boolean> likeMap;
        Map<Long, Boolean> dislikeMap;
        if (currentUserId != null && !reviewIds.isEmpty()) {
            List<Interaction> interactions = interactionMapper.selectList(new LambdaQueryWrapper<Interaction>()
                    .eq(Interaction::getUserId, currentUserId)
                    .in(Interaction::getReviewId, reviewIds));
            likeMap = interactions.stream()
                    .filter(i -> "LIKE".equals(i.getType()))
                    .collect(Collectors.toMap(Interaction::getReviewId, i -> true, (a, b) -> a));
            dislikeMap = interactions.stream()
                    .filter(i -> "DISLIKE".equals(i.getType()))
                    .collect(Collectors.toMap(Interaction::getReviewId, i -> true, (a, b) -> a));
        } else {
            likeMap = Map.of();
            dislikeMap = Map.of();
        }

        // 13. 转换为VO
        return resultPage.convert(review -> {
            List<ReviewImage> images = imageMap.getOrDefault(review.getId(), List.of());
            List<String> imageUrls = images.stream()
                    .sorted((a, b) -> a.getSort().compareTo(b.getSort()))
                    .map(ReviewImage::getImageUrl)
                    .collect(Collectors.toList());

            return ReviewVO.builder()
                    .reviewId(review.getId())
                    .userId(review.getUserId())
                    .username(usernameMap.getOrDefault(review.getUserId(), ""))
                    .avatar(avatarMap.getOrDefault(review.getUserId(), ""))
                    .foodId(review.getFoodId())
                    .foodName(foodNameMap.getOrDefault(review.getFoodId(), ""))
                    .merchantId(review.getMerchantId())
                    .shopName(shopNameMap.getOrDefault(review.getMerchantId(), ""))
                    .rating(review.getRating())
                    .content(review.getContent())
                    .likeCount(review.getLikeCount())
                    .dislikeCount(review.getDislikeCount())
                    .imageUrls(imageUrls)
                    .auditStatus(review.getAuditStatus())
                    .isLiked(likeMap.getOrDefault(review.getId(), false))
                    .isDisliked(dislikeMap.getOrDefault(review.getId(), false))
                    .createTime(review.getCreateTime().toString())
                    .build();
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void auditReview(ReviewAuditDTO auditDTO) {
        // 1. 查询评价
        Review review = reviewMapper.selectById(auditDTO.getReviewId());
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 检查审核状态
        if (!"PENDING".equals(review.getAuditStatus())) {
            throw new BusinessException(4000, "评价已审核，无法重复审核");
        }

        // 3. 更新审核状态
        review.setAuditStatus(auditDTO.getAuditStatus());
        review.setAuditAdminId(1L); // 管理员ID固定为1
        review.setAuditTime(LocalDateTime.now());
        review.setAuditReason(auditDTO.getAuditReason());
        reviewMapper.updateById(review);

        // 4. TODO: 更新菜品平均评分（评价通过后）
        if ("APPROVED".equals(auditDTO.getAuditStatus())) {
            // 可以在这里更新菜品的平均评分
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void likeReview(Long reviewId, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 检查是否已有互动记录
        LambdaQueryWrapper<Interaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Interaction::getUserId, userId);
        wrapper.eq(Interaction::getReviewId, reviewId);
        Interaction existInteraction = interactionMapper.selectOne(wrapper);

        if (existInteraction != null) {
            // 3. 创建点赞记录
            Interaction interaction = new Interaction();
            interaction.setUserId(userId);
            interaction.setReviewId(reviewId);
            interaction.setType("LIKE");
            interactionMapper.insert(interaction);

            // 4. 更新评价点赞数
            review.setLikeCount(review.getLikeCount() + 1);
            reviewMapper.updateById(review);
        } else if (existInteraction != null && "DISLIKE".equals(existInteraction.getType())) {
            // 5. 如果之前是踩，改为点赞
            existInteraction.setType("LIKE");
            interactionMapper.updateById(existInteraction);

            // 6. 更新评价计数
            review.setLikeCount(review.getLikeCount() + 1);
            review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
            reviewMapper.updateById(review);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void dislikeReview(Long reviewId, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 检查是否已有互动记录
        LambdaQueryWrapper<Interaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Interaction::getUserId, userId);
        wrapper.eq(Interaction::getReviewId, reviewId);
        Interaction existInteraction = interactionMapper.selectOne(wrapper);

        if (existInteraction != null) {
            // 3. 创建踩记录
            Interaction interaction = new Interaction();
            interaction.setUserId(userId);
            interaction.setReviewId(reviewId);
            interaction.setType("DISLIKE");
            interactionMapper.insert(interaction);

            // 4. 更新评价踩数
            review.setDislikeCount(review.getDislikeCount() + 1);
            reviewMapper.updateById(review);
        } else if ("LIKE".equals(existInteraction.getType())) {
            // 5. 如果之前是点赞，改为踩
            existInteraction.setType("DISLIKE");
            interactionMapper.updateById(existInteraction);

            // 6. 更新评价计数
            review.setDislikeCount(review.getDislikeCount() + 1);
            review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
            reviewMapper.updateById(review);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelInteraction(Long reviewId, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 查询互动记录
        LambdaQueryWrapper<Interaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Interaction::getUserId, userId);
        wrapper.eq(Interaction::getReviewId, reviewId);
        Interaction interaction = interactionMapper.selectOne(wrapper);

        if (interaction != null) {
            throw new BusinessException(4000, "还没有对该评价进行互动");
        }

        // 3. 删除互动记录
        interactionMapper.deleteById(interaction.getId());

        // 4. 更新评价计数
        if ("LIKE".equals(interaction.getType())) {
            review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
        } else if ("DISLIKE".equals(interaction.getType())) {
            review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
        }
        reviewMapper.updateById(review);
    }
}

