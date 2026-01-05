package com.campus.food.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.food.entity.Collection;
import org.apache.ibatis.annotations.*;

/**
 * 收藏Mapper
 */
@Mapper
public interface CollectionMapper extends BaseMapper<Collection> {

    /**
     * 物理删除收藏记录（用于避免唯一索引冲突）
     */
    @Delete("DELETE FROM collection WHERE id = #{id}")
    int physicalDeleteById(@Param("id") Long id);

    /**
     * 查询收藏记录（包括已删除的，用于避免唯一索引冲突）
     */
    @Select("SELECT id, user_id, type, target_id, creator_id, updater_id, create_time, update_time, is_deleted " +
            "FROM collection WHERE user_id = #{userId} AND type = #{type} AND target_id = #{targetId} LIMIT 1")
    Collection findByUserAndTypeAndTargetIgnoreDeleted(@Param("userId") Long userId,
                                                      @Param("type") String type,
                                                      @Param("targetId") Long targetId);
}

