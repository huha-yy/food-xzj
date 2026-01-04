package com.campus.food.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.food.entity.UserProfile;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户资料Mapper
 */
@Mapper
public interface UserProfileMapper extends BaseMapper<UserProfile> {
}

