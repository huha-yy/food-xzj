package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.ActivityAuditDTO;
import com.campus.food.dto.ActivityQueryDTO;
import com.campus.food.dto.CreateActivityDTO;
import com.campus.food.dto.UpdateActivityDTO;
import com.campus.food.entity.Activity;
import com.campus.food.entity.ActivityImage;
import com.campus.food.entity.Merchant;
import com.campus.food.entity.User;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.ActivityImageMapper;
import com.campus.food.mapper.ActivityMapper;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.mapper.UserMapper;
import com.campus.food.service.ActivityService;
import com.campus.food.vo.ActivityVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 活动服务实现
 */
@Service
@RequiredArgsConstructor
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements ActivityService {

    private final ActivityMapper activityMapper;
    private final ActivityImageMapper activityImageMapper;
    private final MerchantMapper merchantMapper;
    private final UserMapper userMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createActivity(CreateActivityDTO createActivityDTO, Long userId) {
        // 1. 查询商家信息
        LambdaQueryWrapper<Merchant> merchantWrapper = new LambdaQueryWrapper<>();
        merchantWrapper.eq(Merchant::getUserId, userId);
        Merchant merchant = merchantMapper.selectOne(merchantWrapper);

        if (merchant == null || merchant.getIsDeleted() == 1) {
            throw new BusinessException(4000, "商家不存在");
        }

        // 2. 检查商家状态
        if (!"APPROVED".equals(merchant.getAuditStatus()) || !"ACTIVE".equals(merchant.getStatus())) {
            throw new BusinessException(4000, "商家未通过审核或已禁用");
        }

        // 3. 创建活动
        Activity activity = new Activity();
        activity.setMerchantId(merchant.getId());
        activity.setTitle(createActivityDTO.getTitle());
        activity.setContent(createActivityDTO.getContent());
        activity.setStartTime(createActivityDTO.getStartTime());
        activity.setEndTime(createActivityDTO.getEndTime());
        activity.setAuditStatus("PENDING");

        activityMapper.insert(activity);

        // 4. 返回活动ID
        return activity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateActivity(UpdateActivityDTO updateActivityDTO) {
        // 1. 查询活动是否存在
        Activity activity = activityMapper.selectById(updateActivityDTO.getId());
        if (activity == null || activity.getIsDeleted() == 1) {
            throw new BusinessException(4000, "活动不存在");
        }

        // 2. 检查活动是否已审核通过（已通过的活动不能修改）
        if ("APPROVED".equals(activity.getAuditStatus())) {
            throw new BusinessException(4000, "已通过审核的活动不能修改");
        }

        // 3. 更新活动
        activity.setTitle(updateActivityDTO.getTitle());
        activity.setContent(updateActivityDTO.getContent());
        activity.setStartTime(updateActivityDTO.getStartTime());
        activity.setEndTime(updateActivityDTO.getEndTime());
        activityMapper.updateById(activity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteActivity(Long activityId, Long userId, boolean isAdmin) {
        // 1. 查询活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null || activity.getIsDeleted() == 1) {
            throw new BusinessException(4000, "活动不存在");
        }

        // 2. 权限校验：管理员可删除任意活动，商家只能删除自己的活动
        if (!isAdmin) {
            LambdaQueryWrapper<Merchant> merchantWrapper = new LambdaQueryWrapper<>();
            merchantWrapper.eq(Merchant::getUserId, userId);
            Merchant merchant = merchantMapper.selectOne(merchantWrapper);

            if (merchant == null) {
                throw new BusinessException(4000, "商家不存在");
            }

            if (!activity.getMerchantId().equals(merchant.getId())) {
                throw new BusinessException(4000, "只能删除自己的活动");
            }
        }

        // 4. 逻辑删除活动
        activityMapper.deleteById(activityId);

        // 5. 逻辑删除活动图片
        LambdaQueryWrapper<ActivityImage> imageWrapper = new LambdaQueryWrapper<>();
        imageWrapper.eq(ActivityImage::getActivityId, activityId);
        activityImageMapper.delete(imageWrapper);
    }

    @Override
    public ActivityVO getActivityDetail(Long activityId) {
        // 1. 查询活动
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null || activity.getIsDeleted() == 1) {
            throw new BusinessException(4000, "活动不存在");
        }

        // 2. 查询商家信息
        Merchant merchant = merchantMapper.selectById(activity.getMerchantId());

        // 3. 查询审核人信息
        User auditor = activity.getAuditorId() != null ?
                userMapper.selectById(activity.getAuditorId()) : null;

        // 4. 查询活动图片
        LambdaQueryWrapper<ActivityImage> imageWrapper = new LambdaQueryWrapper<>();
        imageWrapper.eq(ActivityImage::getActivityId, activityId);
        imageWrapper.orderByAsc(ActivityImage::getSort);
        List<ActivityImage> activityImages = activityImageMapper.selectList(imageWrapper);
        List<String> imageUrls = activityImages.stream()
                .map(ActivityImage::getImageUrl)
                .collect(Collectors.toList());

        // 5. 转换为VO
        return ActivityVO.builder()
                .id(activity.getId())
                .merchantId(activity.getMerchantId())
                .merchantName(merchant != null ? merchant.getShopName() : "")
                .title(activity.getTitle())
                .content(activity.getContent())
                .startTime(activity.getStartTime().toString())
                .endTime(activity.getEndTime().toString())
                .auditStatus(activity.getAuditStatus())
                .auditorId(activity.getAuditorId())
                .auditorName(auditor != null ? auditor.getUsername() : "")
                .auditTime(activity.getAuditTime() != null ? activity.getAuditTime().toString() : "")
                .auditReason(activity.getAuditReason())
                .imageUrls(imageUrls)
                .createTime(activity.getCreateTime().toString())
                .updateTime(activity.getUpdateTime().toString())
                .build();
    }

    @Override
    public IPage<ActivityVO> getActivityList(ActivityQueryDTO activityQueryDTO) {
        // 1. 构建分页对象
        Page<Activity> page = new Page<>(
                activityQueryDTO.getCurrent() != null ? activityQueryDTO.getCurrent() : 1,
                activityQueryDTO.getPageSize() != null ? activityQueryDTO.getPageSize() : 10
        );

        // 2. 构建查询条件
        LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(activityQueryDTO.getKeyword())) {
            wrapper.and(w -> w.like(Activity::getTitle, activityQueryDTO.getKeyword())
                    .or()
                    .like(Activity::getContent, activityQueryDTO.getKeyword()));
        }
        if (StringUtils.hasText(activityQueryDTO.getAuditStatus())) {
            wrapper.eq(Activity::getAuditStatus, activityQueryDTO.getAuditStatus());
        }
        if (activityQueryDTO.getMerchantId() != null) {
            wrapper.eq(Activity::getMerchantId, activityQueryDTO.getMerchantId());
        }
        wrapper.orderByDesc(Activity::getCreateTime);

        // 3. 查询
        IPage<Activity> resultPage = activityMapper.selectPage(page, wrapper);

        // 4. 获取所有商家ID和审核人ID
        java.util.List<Long> merchantIds = resultPage.getRecords().stream()
                .map(Activity::getMerchantId).distinct().collect(Collectors.toList());
        java.util.List<Long> auditorIds = resultPage.getRecords().stream()
                .filter(a -> a.getAuditorId() != null)
                .map(Activity::getAuditorId).distinct().collect(Collectors.toList());

        // 5. 批量查询商家和审核人信息
        Map<Long, String> merchantNameMap = merchantIds.isEmpty() ? Map.of() :
                merchantMapper.selectBatchIds(merchantIds).stream()
                        .collect(Collectors.toMap(Merchant::getId, Merchant::getShopName));
        Map<Long, String> auditorNameMap = auditorIds.isEmpty() ? Map.of() :
                userMapper.selectBatchIds(auditorIds).stream()
                        .collect(Collectors.toMap(User::getId, User::getUsername));

        // 6. 批量查询活动图片
        List<Long> activityIds = resultPage.getRecords().stream()
                .map(Activity::getId)
                .collect(Collectors.toList());
        Map<Long, List<String>> imageMap;
        if (activityIds.isEmpty()) {
            imageMap = Map.of();
        } else {
            List<ActivityImage> allImages = activityImageMapper.selectList(
                    new LambdaQueryWrapper<ActivityImage>()
                            .in(ActivityImage::getActivityId, activityIds)
            );
            imageMap = allImages.stream()
                    .collect(Collectors.groupingBy(
                            ActivityImage::getActivityId,
                            Collectors.mapping(ActivityImage::getImageUrl, Collectors.toList())
                    ));
        }

        // 7. 转换为VO
        return resultPage.convert(activity -> {
            return ActivityVO.builder()
                    .id(activity.getId())
                    .merchantId(activity.getMerchantId())
                    .merchantName(merchantNameMap.getOrDefault(activity.getMerchantId(), ""))
                    .title(activity.getTitle())
                    .content(activity.getContent())
                    .startTime(activity.getStartTime().toString())
                    .endTime(activity.getEndTime().toString())
                    .auditStatus(activity.getAuditStatus())
                    .auditorId(activity.getAuditorId())
                    .auditorName(activity.getAuditorId() != null ?
                            auditorNameMap.getOrDefault(activity.getAuditorId(), "") : "")
                    .auditTime(activity.getAuditTime() != null ? activity.getAuditTime().toString() : "")
                    .auditReason(activity.getAuditReason())
                    .imageUrls(imageMap.getOrDefault(activity.getId(), List.of()))
                    .createTime(activity.getCreateTime().toString())
                    .updateTime(activity.getUpdateTime().toString())
                    .build();
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void auditActivity(ActivityAuditDTO activityAuditDTO, Long userId) {
        // 1. 查询活动是否存在
        Activity activity = activityMapper.selectById(activityAuditDTO.getId());
        if (activity == null || activity.getIsDeleted() == 1) {
            throw new BusinessException(4000, "活动不存在");
        }

        // 2. 检查活动状态
        if (!"PENDING".equals(activity.getAuditStatus())) {
            throw new BusinessException(4000, "只能审核待审核的活动");
        }

        // 3. 检查审核结果
        if (!"APPROVED".equals(activityAuditDTO.getAuditResult())
                && !"REJECTED".equals(activityAuditDTO.getAuditResult())) {
            throw new BusinessException(4000, "审核结果不正确");
        }

        // 4. 如果是驳回，必须填写审核理由
        if ("REJECTED".equals(activityAuditDTO.getAuditResult())
                && !StringUtils.hasText(activityAuditDTO.getAuditReason())) {
            throw new BusinessException(4000, "驳回时必须填写审核理由");
        }

        // 5. 更新活动审核状态
        activity.setAuditStatus(activityAuditDTO.getAuditResult());
        activity.setAuditorId(userId);
        activity.setAuditTime(java.time.LocalDateTime.now());
        activity.setAuditReason(activityAuditDTO.getAuditReason());
        activityMapper.updateById(activity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addActivityImage(Long activityId, String imageUrl, Long userId) {
        // 1. 查询活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null || activity.getIsDeleted() == 1) {
            throw new BusinessException(4000, "活动不存在");
        }

        // 2. 查询商家信息
        LambdaQueryWrapper<Merchant> merchantWrapper = new LambdaQueryWrapper<>();
        merchantWrapper.eq(Merchant::getUserId, userId);
        Merchant merchant = merchantMapper.selectOne(merchantWrapper);

        if (merchant == null) {
            throw new BusinessException(4000, "商家不存在");
        }

        // 3. 检查是否为该商家的活动
        if (!activity.getMerchantId().equals(merchant.getId())) {
            throw new BusinessException(4000, "只能为自己的活动添加图片");
        }

        // 4. 查询当前图片数量
        LambdaQueryWrapper<ActivityImage> countWrapper = new LambdaQueryWrapper<>();
        countWrapper.eq(ActivityImage::getActivityId, activityId);
        long count = activityImageMapper.selectCount(countWrapper);

        // 5. 添加活动图片
        ActivityImage activityImage = new ActivityImage();
        activityImage.setActivityId(activityId);
        activityImage.setImageUrl(imageUrl);
        activityImage.setSort((int) count + 1);
        activityImageMapper.insert(activityImage);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteActivityImage(Long imageId, Long userId) {
        // 1. 查询图片是否存在
        ActivityImage activityImage = activityImageMapper.selectById(imageId);
        if (activityImage == null || activityImage.getIsDeleted() == 1) {
            throw new BusinessException(4000, "图片不存在");
        }

        // 2. 查询活动是否存在
        Activity activity = activityMapper.selectById(activityImage.getActivityId());
        if (activity == null || activity.getIsDeleted() == 1) {
            throw new BusinessException(4000, "活动不存在");
        }

        // 3. 查询商家信息
        LambdaQueryWrapper<Merchant> merchantWrapper = new LambdaQueryWrapper<>();
        merchantWrapper.eq(Merchant::getUserId, userId);
        Merchant merchant = merchantMapper.selectOne(merchantWrapper);

        if (merchant == null) {
            throw new BusinessException(4000, "商家不存在");
        }

        // 4. 检查是否为该商家的活动
        if (!activity.getMerchantId().equals(merchant.getId())) {
            throw new BusinessException(4000, "只能删除自己活动的图片");
        }

        // 5. 逻辑删除图片
        activityImageMapper.deleteById(imageId);
    }
}

