package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.CreateReviewDTO;
import com.campus.food.dto.ReviewAuditDTO;
import com.campus.food.dto.ReviewQueryDTO;
import com.campus.food.dto.UpdateReviewDTO;
import com.campus.food.entity.*;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.*;
import com.campus.food.service.ReviewService;
import com.campus.food.vo.ReviewStatisticsVO;
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
    private final com.campus.food.service.ReviewReplyService reviewReplyService;
    private final com.campus.food.service.ReviewTagService reviewTagService;

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

        // 4. 保存评价标签
        if (createReviewDTO.getTagIds() != null && !createReviewDTO.getTagIds().isEmpty()) {
            reviewTagService.addTagsToReview(review.getId(), createReviewDTO.getTagIds());
        }

        // 5. 更新菜品销量（评价数作为销量）
        food.setSalesCount(food.getSalesCount() != null ? food.getSalesCount() + 1 : 1);
        foodMapper.updateById(food);

        // 6. 返回评价ID
        return review.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateReview(UpdateReviewDTO updateReviewDTO, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(updateReviewDTO.getReviewId());
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 只有作者本人可修改
        if (!review.getUserId().equals(userId)) {
            throw new BusinessException(4000, "只能修改自己的评价");
        }

        // 3. 只有待审核或驳回状态才允许修改
        if ("APPROVED".equals(review.getAuditStatus())) {
            throw new BusinessException(4000, "已通过审核的评价不能修改");
        }

        // 4. 更新评价内容，修改后重置为待审核
        review.setRating(updateReviewDTO.getRating());
        review.setContent(updateReviewDTO.getContent());
        review.setAuditStatus("PENDING");
        review.setAuditAdminId(null);
        review.setAuditTime(null);
        review.setAuditReason(null);
        reviewMapper.updateById(review);

        // 5. 更新图片：先删后插
        LambdaQueryWrapper<ReviewImage> imageWrapper = new LambdaQueryWrapper<>();
        imageWrapper.eq(ReviewImage::getReviewId, review.getId());
        reviewImageMapper.delete(imageWrapper);
        if (updateReviewDTO.getImageUrls() != null && !updateReviewDTO.getImageUrls().isEmpty()) {
            for (int i = 0; i < updateReviewDTO.getImageUrls().size(); i++) {
                ReviewImage reviewImage = new ReviewImage();
                reviewImage.setReviewId(review.getId());
                reviewImage.setImageUrl(updateReviewDTO.getImageUrls().get(i));
                reviewImage.setSort(i);
                reviewImageMapper.insert(reviewImage);
            }
        }

        // 6. 更新标签：先清除旧关联，再插入新关联
        reviewTagService.removeTagsByReviewId(review.getId());
        if (updateReviewDTO.getTagIds() != null && !updateReviewDTO.getTagIds().isEmpty()) {
            reviewTagService.addTagsToReview(review.getId(), updateReviewDTO.getTagIds());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteReview(Long reviewId, Long userId, boolean isAdmin) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 检查权限：管理员可删除任意评价，普通用户只能删除自己的评价
        if (!isAdmin && !review.getUserId().equals(userId)) {
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

        // 6. 更新菜品销量（减少1）
        Food food = foodMapper.selectById(review.getFoodId());
        if (food != null && food.getSalesCount() != null && food.getSalesCount() > 0) {
            food.setSalesCount(food.getSalesCount() - 1);
            foodMapper.updateById(food);
        }

        // 7. 如果删除的是已通过审核的评价，需要重新计算平均评分
        if ("APPROVED".equals(review.getAuditStatus())) {
            updateFoodRatingAvg(review.getFoodId());
        }
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

        // 7. 查询商家回复
        com.campus.food.vo.ReviewReplyVO reply = reviewReplyService.getReplyByReviewId(reviewId);

        // 8. 查询评价标签
        java.util.List<com.campus.food.vo.ReviewTagVO> tags = reviewTagService.getTagsByReviewId(reviewId);

        // 9. 构建返回对象
        ReviewVO reviewVO = ReviewVO.builder()
                .reviewId(review.getId())
                .userId(review.getUserId())
                .username(userProfile != null && userProfile.getNickname() != null ? userProfile.getNickname() : "")
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
                .reply(reply)
                .tags(tags)
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

        // 6. 按审核状态筛选（空字符串表示不过滤，null且非个人中心查询时默认只查已审核通过的评价）
        String auditStatus = reviewQueryDTO.getAuditStatus();
        if (auditStatus != null && !auditStatus.isEmpty()) {
            wrapper.eq(Review::getAuditStatus, auditStatus);
        } else if (auditStatus == null && reviewQueryDTO.getUserId() == null) {
            // 非个人中心查询且未指定状态，默认只显示已审核通过的评价
            wrapper.eq(Review::getAuditStatus, "APPROVED");
        }

        // 7. 按评分筛选
        if (reviewQueryDTO.getRating() != null) {
            wrapper.eq(Review::getRating, reviewQueryDTO.getRating());
        }

        // 8. 排序
        String sortBy = reviewQueryDTO.getSortBy();
        String sortOrder = reviewQueryDTO.getSortOrder();
        if ("hot".equals(sortBy)) {
            // 按热度排序（点赞数 - 踩数）
            if ("asc".equals(sortOrder)) {
                wrapper.orderByAsc(Review::getLikeCount);
            } else {
                wrapper.orderByDesc(Review::getLikeCount);
            }
        } else if ("rating".equals(sortBy)) {
            // 按评分排序
            if ("asc".equals(sortOrder)) {
                wrapper.orderByAsc(Review::getRating);
            } else {
                wrapper.orderByDesc(Review::getRating);
            }
        } else {
            // 默认按时间排序
            if ("asc".equals(sortOrder)) {
                wrapper.orderByAsc(Review::getCreateTime);
            } else {
                wrapper.orderByDesc(Review::getCreateTime);
            }
        }

        // 8. 查询
        IPage<Review> resultPage = reviewMapper.selectPage(page, wrapper);

        // 9. 获取所有相关ID
        List<Long> userIds = resultPage.getRecords().stream()
                .map(Review::getUserId).distinct().collect(Collectors.toList());
        List<Long> foodIds = resultPage.getRecords().stream()
                .map(Review::getFoodId).distinct().collect(Collectors.toList());
        List<Long> merchantIds = resultPage.getRecords().stream()
                .map(Review::getMerchantId).distinct().collect(Collectors.toList());

        // 10. 批量查询用户昵称和头像
        List<UserProfile> userProfiles = userIds.isEmpty() ? List.of() :
                userProfileMapper.selectList(new LambdaQueryWrapper<UserProfile>()
                        .in(UserProfile::getUserId, userIds));
        Map<Long, String> usernameMap = userProfiles.stream()
                .collect(Collectors.toMap(
                        UserProfile::getUserId,
                        profile -> profile.getNickname() != null ? profile.getNickname() : "",
                        (v1, v2) -> v1
                ));
        Map<Long, String> avatarMap = userProfiles.stream()
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

            // 查询商家回复
            com.campus.food.vo.ReviewReplyVO reply = reviewReplyService.getReplyByReviewId(review.getId());

            // 查询评价标签
            java.util.List<com.campus.food.vo.ReviewTagVO> tags = reviewTagService.getTagsByReviewId(review.getId());

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
                    .reply(reply)
                    .tags(tags)
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

        // 4. 更新菜品平均评分（评价通过后）
        if ("APPROVED".equals(auditDTO.getAuditStatus())) {
            updateFoodRatingAvg(review.getFoodId());
        }
    }

    /**
     * 更新菜品的平均评分
     */
    private void updateFoodRatingAvg(Long foodId) {
        // 查询该菜品所有已通过审核的评价
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getFoodId, foodId)
                .eq(Review::getAuditStatus, "APPROVED")
                .eq(Review::getIsDeleted, 0);
        List<Review> approvedReviews = reviewMapper.selectList(wrapper);

        // 计算平均评分
        java.math.BigDecimal avgRating = java.math.BigDecimal.ZERO;
        if (!approvedReviews.isEmpty()) {
            double sum = approvedReviews.stream()
                    .mapToInt(Review::getRating)
                    .sum();
            avgRating = java.math.BigDecimal.valueOf(sum / approvedReviews.size())
                    .setScale(1, java.math.RoundingMode.HALF_UP);
        }

        // 更新菜品平均评分
        Food food = foodMapper.selectById(foodId);
        if (food != null) {
            food.setRatingAvg(avgRating);
            foodMapper.updateById(food);
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

        // 2. 检查是否已有互动记录（包括已删除的）
        Interaction existInteraction = interactionMapper.selectOne(
                new LambdaQueryWrapper<Interaction>()
                        .eq(Interaction::getUserId, userId)
                        .eq(Interaction::getReviewId, reviewId)
                        .last("LIMIT 1")
        );

        if (existInteraction == null) {
            // 3. 没有记录，直接创建点赞记录
            try {
                Interaction interaction = new Interaction();
                interaction.setUserId(userId);
                interaction.setReviewId(reviewId);
                interaction.setType("LIKE");
                interactionMapper.insert(interaction);

                // 4. 更新评价点赞数
                review.setLikeCount(review.getLikeCount() + 1);
                reviewMapper.updateById(review);
            } catch (Exception e) {
                // 如果是唯一索引冲突，说明存在已逻辑删除的记录
                if (e.getMessage() != null && e.getMessage().contains("Duplicate entry")) {
                    // 查找旧记录（包括已删除的）
                    Interaction oldInteraction = interactionMapper.selectOne(
                            new LambdaQueryWrapper<Interaction>()
                                    .eq(Interaction::getUserId, userId)
                                    .eq(Interaction::getReviewId, reviewId)
                                    .last("LIMIT 1")
                    );
                    if (oldInteraction != null) {
                        // 物理删除旧记录
                        interactionMapper.physicalDeleteById(oldInteraction.getId());
                    }
                    // 重新插入
                    Interaction interaction = new Interaction();
                    interaction.setUserId(userId);
                    interaction.setReviewId(reviewId);
                    interaction.setType("LIKE");
                    interactionMapper.insert(interaction);

                    // 更新评价点赞数
                    review.setLikeCount(review.getLikeCount() + 1);
                    reviewMapper.updateById(review);
                } else {
                    throw e;
                }
            }
        } else if ("DISLIKE".equals(existInteraction.getType())) {
            // 5. 如果之前是踩，改为点赞
            existInteraction.setType("LIKE");
            interactionMapper.updateById(existInteraction);

            // 6. 更新评价计数
            review.setLikeCount(review.getLikeCount() + 1);
            review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
            reviewMapper.updateById(review);
        }
        // 如果已有点赞记录，不做任何事
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void dislikeReview(Long reviewId, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 查找现有记录（包括已删除的）
        Interaction existInteraction = interactionMapper.selectOne(
                new LambdaQueryWrapper<Interaction>()
                        .eq(Interaction::getUserId, userId)
                        .eq(Interaction::getReviewId, reviewId)
                        .last("LIMIT 1")
        );

        // 3. 如果有记录，先物理删除它
        if (existInteraction != null) {
            if ("DISLIKE".equals(existInteraction.getType())) {
                // 已有踩，不做任何事
                return;
            }
            // 物理删除旧记录
            interactionMapper.physicalDeleteById(existInteraction.getId());
        }

        // 4. 创建新的踩记录
        Interaction interaction = new Interaction();
        interaction.setUserId(userId);
        interaction.setReviewId(reviewId);
        interaction.setType("DISLIKE");
        interactionMapper.insert(interaction);

        // 5. 更新评价计数
        if (existInteraction != null && "LIKE".equals(existInteraction.getType())) {
            // 之前是点赞，改为踩（点赞数-1，踩数+1）
            review.setDislikeCount(review.getDislikeCount() + 1);
            review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
        } else {
            // 新增踩
            review.setDislikeCount(review.getDislikeCount() + 1);
        }
        reviewMapper.updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelInteraction(Long reviewId, Long userId) {
        // 1. 查询评价是否存在
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || review.getIsDeleted() == 1) {
            throw new BusinessException(4000, "评价不存在");
        }

        // 2. 查询互动记录（包括已删除的）
        Interaction interaction = interactionMapper.selectOne(
                new LambdaQueryWrapper<Interaction>()
                        .eq(Interaction::getUserId, userId)
                        .eq(Interaction::getReviewId, reviewId)
                        .last("LIMIT 1")
        );

        if (interaction == null) {
            throw new BusinessException(4000, "还没有对该评价进行互动");
        }

        // 3. 使用物理删除，避免唯一索引冲突
        interactionMapper.physicalDeleteById(interaction.getId());

        // 4. 更新评价计数
        if ("LIKE".equals(interaction.getType())) {
            review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
        } else if ("DISLIKE".equals(interaction.getType())) {
            review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
        }
        reviewMapper.updateById(review);
    }

    @Override
    public ReviewStatisticsVO getReviewStatistics() {
        // 1. 查询评价总数（只统计已审核通过的评价）
        LambdaQueryWrapper<Review> totalCountWrapper = new LambdaQueryWrapper<>();
        totalCountWrapper.eq(Review::getAuditStatus, "APPROVED");
        Long totalCount = reviewMapper.selectCount(totalCountWrapper);

        // 2. 查询平均评分（只统计已审核通过的评价）
        LambdaQueryWrapper<Review> avgRatingWrapper = new LambdaQueryWrapper<>();
        avgRatingWrapper.eq(Review::getAuditStatus, "APPROVED");
        List<Review> allReviews = reviewMapper.selectList(avgRatingWrapper);
        double averageRating = 0.0;
        if (!allReviews.isEmpty()) {
            int sum = allReviews.stream()
                    .mapToInt(Review::getRating)
                    .sum();
            averageRating = (double) sum / allReviews.size();
        }

        // 3. 查询今日新增评价数
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LambdaQueryWrapper<Review> todayCountWrapper = new LambdaQueryWrapper<>();
        todayCountWrapper.eq(Review::getAuditStatus, "APPROVED");
        todayCountWrapper.ge(Review::getCreateTime, todayStart);
        Long todayCount = reviewMapper.selectCount(todayCountWrapper);

        // 4. 构建返回对象
        return ReviewStatisticsVO.builder()
                .totalCount(totalCount)
                .averageRating(Math.round(averageRating * 10.0) / 10.0)  // 保留一位小数
                .todayCount(todayCount)
                .build();
    }

    @Override
    public com.campus.food.vo.RatingDistributionVO getRatingDistribution(Long foodId) {
        // 构建查询条件
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getAuditStatus, "APPROVED");
        if (foodId != null) {
            wrapper.eq(Review::getFoodId, foodId);
        }

        // 查询所有评价
        List<Review> reviews = reviewMapper.selectList(wrapper);

        // 统计各星级数量
        long fiveStarCount = reviews.stream().filter(r -> r.getRating() == 5).count();
        long fourStarCount = reviews.stream().filter(r -> r.getRating() == 4).count();
        long threeStarCount = reviews.stream().filter(r -> r.getRating() == 3).count();
        long twoStarCount = reviews.stream().filter(r -> r.getRating() == 2).count();
        long oneStarCount = reviews.stream().filter(r -> r.getRating() == 1).count();

        // 计算平均评分
        double averageRating = 0.0;
        if (!reviews.isEmpty()) {
            int sum = reviews.stream().mapToInt(Review::getRating).sum();
            averageRating = (double) sum / reviews.size();
        }

        // 构建返回对象
        return com.campus.food.vo.RatingDistributionVO.builder()
                .fiveStarCount(fiveStarCount)
                .fourStarCount(fourStarCount)
                .threeStarCount(threeStarCount)
                .twoStarCount(twoStarCount)
                .oneStarCount(oneStarCount)
                .totalCount((long) reviews.size())
                .averageRating(Math.round(averageRating * 10.0) / 10.0)
                .build();
    }
}

