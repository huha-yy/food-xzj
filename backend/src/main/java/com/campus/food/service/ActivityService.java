package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.ActivityAuditDTO;
import com.campus.food.dto.ActivityQueryDTO;
import com.campus.food.dto.CreateActivityDTO;
import com.campus.food.dto.UpdateActivityDTO;
import com.campus.food.vo.ActivityVO;

/**
 * 活动服务接口
 */
public interface ActivityService {

    /**
     * 创建活动
     */
    Long createActivity(CreateActivityDTO createActivityDTO, Long userId);

    /**
     * 修改活动
     */
    void updateActivity(UpdateActivityDTO updateActivityDTO);

    /**
     * 删除活动
     */
    void deleteActivity(Long activityId, Long userId);

    /**
     * 查询活动详情
     */
    ActivityVO getActivityDetail(Long activityId);

    /**
     * 查询活动列表
     */
    IPage<ActivityVO> getActivityList(ActivityQueryDTO activityQueryDTO);

    /**
     * 活动审核
     */
    void auditActivity(ActivityAuditDTO activityAuditDTO, Long userId);

    /**
     * 添加活动图片
     */
    void addActivityImage(Long activityId, String imageUrl, Long userId);

    /**
     * 删除活动图片
     */
    void deleteActivityImage(Long imageId, Long userId);
}

