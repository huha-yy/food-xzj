package com.campus.food.service;

import com.campus.food.vo.StatisticsVO;

/**
 * 管理员服务接口
 */
public interface AdminService {

    /**
     * 获取统计数据
     */
    StatisticsVO getStatistics();
}

