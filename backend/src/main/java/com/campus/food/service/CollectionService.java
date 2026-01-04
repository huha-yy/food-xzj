package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.CreateCollectionDTO;
import com.campus.food.vo.CollectionVO;

/**
 * 收藏服务接口
 */
public interface CollectionService {

    /**
     * 添加收藏
     */
    Long addCollection(CreateCollectionDTO createCollectionDTO, Long userId);

    /**
     * 取消收藏
     */
    void cancelCollection(Long collectionId, Long userId);

    /**
     * 查询收藏列表
     */
    IPage<CollectionVO> getCollectionList(Long userId, Integer current, Integer pageSize, String type);

    /**
     * 检查收藏状态
     */
    Boolean checkCollectionStatus(Long userId, String type, Long targetId);
}

