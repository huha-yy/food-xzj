package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.entity.ReviewTag;
import com.campus.food.entity.ReviewTagRelation;
import com.campus.food.mapper.ReviewTagMapper;
import com.campus.food.mapper.ReviewTagRelationMapper;
import com.campus.food.service.ReviewTagService;
import com.campus.food.vo.ReviewTagVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 评价标签服务实现
 */
@Service
@RequiredArgsConstructor
public class ReviewTagServiceImpl extends ServiceImpl<ReviewTagMapper, ReviewTag> implements ReviewTagService {

    private final ReviewTagMapper reviewTagMapper;
    private final ReviewTagRelationMapper reviewTagRelationMapper;

    @Override
    public List<ReviewTagVO> getAllTags() {
        LambdaQueryWrapper<ReviewTag> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(ReviewTag::getSort);
        List<ReviewTag> tags = reviewTagMapper.selectList(wrapper);

        return tags.stream()
                .map(tag -> ReviewTagVO.builder()
                        .tagId(tag.getId())
                        .name(tag.getName())
                        .type(tag.getType())
                        .icon(tag.getIcon())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewTagVO> getTagsByReviewId(Long reviewId) {
        // 查询评价的标签关联
        LambdaQueryWrapper<ReviewTagRelation> relationWrapper = new LambdaQueryWrapper<>();
        relationWrapper.eq(ReviewTagRelation::getReviewId, reviewId);
        List<ReviewTagRelation> relations = reviewTagRelationMapper.selectList(relationWrapper);

        if (relations.isEmpty()) {
            return List.of();
        }

        // 查询标签详情
        List<Long> tagIds = relations.stream()
                .map(ReviewTagRelation::getTagId)
                .collect(Collectors.toList());

        List<ReviewTag> tags = reviewTagMapper.selectBatchIds(tagIds);

        return tags.stream()
                .map(tag -> ReviewTagVO.builder()
                        .tagId(tag.getId())
                        .name(tag.getName())
                        .type(tag.getType())
                        .icon(tag.getIcon())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addTagsToReview(Long reviewId, List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return;
        }

        // 删除已有的标签关联
        LambdaQueryWrapper<ReviewTagRelation> deleteWrapper = new LambdaQueryWrapper<>();
        deleteWrapper.eq(ReviewTagRelation::getReviewId, reviewId);
        reviewTagRelationMapper.delete(deleteWrapper);

        // 添加新的标签关联
        for (Long tagId : tagIds) {
            ReviewTagRelation relation = new ReviewTagRelation();
            relation.setReviewId(reviewId);
            relation.setTagId(tagId);
            reviewTagRelationMapper.insert(relation);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeTagsByReviewId(Long reviewId) {
        LambdaQueryWrapper<ReviewTagRelation> deleteWrapper = new LambdaQueryWrapper<>();
        deleteWrapper.eq(ReviewTagRelation::getReviewId, reviewId);
        reviewTagRelationMapper.delete(deleteWrapper);
    }
}
