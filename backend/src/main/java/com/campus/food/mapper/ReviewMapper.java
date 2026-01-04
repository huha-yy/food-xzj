package com.campus.food.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.food.entity.Review;
import org.apache.ibatis.annotations.Mapper;

/**
 * 评价Mapper
 */
@Mapper
public interface ReviewMapper extends BaseMapper<Review> {
}

