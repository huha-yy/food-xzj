package com.campus.food.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.food.entity.ReviewTagRelation;
import org.apache.ibatis.annotations.Mapper;

/**
 * 评价标签关联Mapper
 */
@Mapper
public interface ReviewTagRelationMapper extends BaseMapper<ReviewTagRelation> {
}
