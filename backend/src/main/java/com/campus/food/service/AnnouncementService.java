package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.AnnouncementQueryDTO;
import com.campus.food.dto.CreateAnnouncementDTO;
import com.campus.food.dto.UpdateAnnouncementDTO;
import com.campus.food.vo.AnnouncementVO;

/**
 * 公告服务接口
 */
public interface AnnouncementService {

    /**
     * 创建公告
     */
    Long createAnnouncement(CreateAnnouncementDTO createAnnouncementDTO, Long userId);

    /**
     * 修改公告
     */
    void updateAnnouncement(UpdateAnnouncementDTO updateAnnouncementDTO, Long userId);

    /**
     * 删除公告
     */
    void deleteAnnouncement(Long announcementId);

    /**
     * 查询公告详情
     */
    AnnouncementVO getAnnouncementDetail(Long announcementId);

    /**
     * 查询公告列表
     */
    IPage<AnnouncementVO> getAnnouncementList(AnnouncementQueryDTO announcementQueryDTO);

    /**
     * 发布公告
     */
    void publishAnnouncement(Long announcementId, Long userId);
}

