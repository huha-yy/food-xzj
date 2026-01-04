package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.AnnouncementQueryDTO;
import com.campus.food.dto.CreateAnnouncementDTO;
import com.campus.food.dto.UpdateAnnouncementDTO;
import com.campus.food.entity.Announcement;
import com.campus.food.entity.User;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.AnnouncementMapper;
import com.campus.food.mapper.UserMapper;
import com.campus.food.service.AnnouncementService;
import com.campus.food.vo.AnnouncementVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 公告服务实现
 */
@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl extends ServiceImpl<AnnouncementMapper, Announcement> implements AnnouncementService {

    private final AnnouncementMapper announcementMapper;
    private final UserMapper userMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createAnnouncement(CreateAnnouncementDTO createAnnouncementDTO, Long userId) {
        // 1. 检查状态
        if (!"PUBLISHED".equals(createAnnouncementDTO.getStatus())
                && !"DRAFT".equals(createAnnouncementDTO.getStatus())) {
            throw new BusinessException(4000, "状态不正确");
        }

        // 2. 创建公告
        Announcement announcement = new Announcement();
        announcement.setTitle(createAnnouncementDTO.getTitle());
        announcement.setContent(createAnnouncementDTO.getContent());
        announcement.setPublisherId(userId);
        announcement.setStatus(createAnnouncementDTO.getStatus());

        // 3. 如果是已发布，设置发布时间
        if ("PUBLISHED".equals(createAnnouncementDTO.getStatus())) {
            announcement.setPublishTime(LocalDateTime.now());
        }

        announcementMapper.insert(announcement);

        // 4. 返回公告ID
        return announcement.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAnnouncement(UpdateAnnouncementDTO updateAnnouncementDTO, Long userId) {
        // 1. 查询公告是否存在
        Announcement announcement = announcementMapper.selectById(updateAnnouncementDTO.getId());
        if (announcement == null || announcement.getIsDeleted() == 1) {
            throw new BusinessException(4000, "公告不存在");
        }

        // 2. 检查状态
        if (!"PUBLISHED".equals(updateAnnouncementDTO.getStatus())
                && !"DRAFT".equals(updateAnnouncementDTO.getStatus())) {
            throw new BusinessException(4000, "状态不正确");
        }

        // 3. 更新公告
        announcement.setTitle(updateAnnouncementDTO.getTitle());
        announcement.setContent(updateAnnouncementDTO.getContent());
        announcement.setStatus(updateAnnouncementDTO.getStatus());

        // 4. 如果是从草稿改为已发布，设置发布时间
        if ("DRAFT".equals(announcement.getStatus())
                && "PUBLISHED".equals(updateAnnouncementDTO.getStatus())) {
            announcement.setPublishTime(LocalDateTime.now());
        }

        announcementMapper.updateById(announcement);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAnnouncement(Long announcementId) {
        // 1. 查询公告是否存在
        Announcement announcement = announcementMapper.selectById(announcementId);
        if (announcement == null || announcement.getIsDeleted() == 1) {
            throw new BusinessException(4000, "公告不存在");
        }

        // 2. 逻辑删除公告
        announcementMapper.deleteById(announcementId);
    }

    @Override
    public AnnouncementVO getAnnouncementDetail(Long announcementId) {
        // 1. 查询公告
        Announcement announcement = announcementMapper.selectById(announcementId);
        if (announcement == null || announcement.getIsDeleted() == 1) {
            throw new BusinessException(4000, "公告不存在");
        }

        // 2. 查询发布人信息
        User publisher = userMapper.selectById(announcement.getPublisherId());

        // 3. 转换为VO
        return AnnouncementVO.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .publisherId(announcement.getPublisherId())
                .publisherName(publisher != null ? publisher.getUsername() : "")
                .publishTime(announcement.getPublishTime() != null ? announcement.getPublishTime().toString() : "")
                .status(announcement.getStatus())
                .createTime(announcement.getCreateTime().toString())
                .updateTime(announcement.getUpdateTime().toString())
                .build();
    }

    @Override
    public IPage<AnnouncementVO> getAnnouncementList(AnnouncementQueryDTO announcementQueryDTO) {
        // 1. 构建分页对象
        Page<Announcement> page = new Page<>(
                announcementQueryDTO.getCurrent() != null ? announcementQueryDTO.getCurrent() : 1,
                announcementQueryDTO.getPageSize() != null ? announcementQueryDTO.getPageSize() : 10
        );

        // 2. 构建查询条件
        LambdaQueryWrapper<Announcement> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(announcementQueryDTO.getKeyword())) {
            wrapper.and(w -> w.like(Announcement::getTitle, announcementQueryDTO.getKeyword())
                    .or()
                    .like(Announcement::getContent, announcementQueryDTO.getKeyword()));
        }
        if (StringUtils.hasText(announcementQueryDTO.getStatus())) {
            wrapper.eq(Announcement::getStatus, announcementQueryDTO.getStatus());
        }
        wrapper.orderByDesc(Announcement::getCreateTime);

        // 3. 查询
        IPage<Announcement> resultPage = announcementMapper.selectPage(page, wrapper);

        // 4. 获取所有发布人ID
        java.util.List<Long> publisherIds = resultPage.getRecords().stream()
                .map(Announcement::getPublisherId).distinct().collect(Collectors.toList());

        // 5. 批量查询发布人信息
        Map<Long, String> publisherNameMap = publisherIds.isEmpty() ? Map.of() :
                userMapper.selectBatchIds(publisherIds).stream()
                        .collect(Collectors.toMap(User::getId, User::getUsername));

        // 6. 转换为VO
        return resultPage.convert(announcement -> {
            return AnnouncementVO.builder()
                    .id(announcement.getId())
                    .title(announcement.getTitle())
                    .content(announcement.getContent())
                    .publisherId(announcement.getPublisherId())
                    .publisherName(publisherNameMap.getOrDefault(announcement.getPublisherId(), ""))
                    .publishTime(announcement.getPublishTime() != null ? announcement.getPublishTime().toString() : "")
                    .status(announcement.getStatus())
                    .createTime(announcement.getCreateTime().toString())
                    .updateTime(announcement.getUpdateTime().toString())
                    .build();
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void publishAnnouncement(Long announcementId, Long userId) {
        // 1. 查询公告是否存在
        Announcement announcement = announcementMapper.selectById(announcementId);
        if (announcement == null || announcement.getIsDeleted() == 1) {
            throw new BusinessException(4000, "公告不存在");
        }

        // 2. 检查是否已发布
        if ("PUBLISHED".equals(announcement.getStatus())) {
            throw new BusinessException(4000, "公告已发布");
        }

        // 3. 发布公告
        announcement.setStatus("PUBLISHED");
        announcement.setPublishTime(LocalDateTime.now());
        announcementMapper.updateById(announcement);
    }
}

