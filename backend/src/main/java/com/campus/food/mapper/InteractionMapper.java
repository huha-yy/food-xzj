package com.campus.food.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.food.entity.Interaction;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 互动Mapper
 */
@Mapper
public interface InteractionMapper extends BaseMapper<Interaction> {

    /**
     * 物理删除互动记录（用于避免唯一索引冲突）
     */
    @Delete("DELETE FROM interaction WHERE id = #{id}")
    int physicalDeleteById(@Param("id") Long id);
}

