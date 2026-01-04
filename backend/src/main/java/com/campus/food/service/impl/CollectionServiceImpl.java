package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.CreateCollectionDTO;
import com.campus.food.entity.Collection;
import com.campus.food.entity.Food;
import com.campus.food.entity.Merchant;
import com.campus.food.entity.User;
import com.campus.food.entity.UserProfile;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.CollectionMapper;
import com.campus.food.mapper.FoodMapper;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.mapper.UserMapper;
import com.campus.food.mapper.UserProfileMapper;
import com.campus.food.service.CollectionService;
import com.campus.food.vo.CollectionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 收藏服务实现
 */
@Service
@RequiredArgsConstructor
public class CollectionServiceImpl extends ServiceImpl<CollectionMapper, Collection> implements CollectionService {

    private final CollectionMapper collectionMapper;
    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final FoodMapper foodMapper;
    private final MerchantMapper merchantMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addCollection(CreateCollectionDTO createCollectionDTO, Long userId) {
        // 1. 检查收藏类型
        if (!"MERCHANT".equals(createCollectionDTO.getType()) && !"FOOD".equals(createCollectionDTO.getType())) {
            throw new BusinessException(4000, "收藏类型不正确");
        }

        // 2. 检查目标是否存在
        if ("MERCHANT".equals(createCollectionDTO.getType())) {
            Merchant merchant = merchantMapper.selectById(createCollectionDTO.getTargetId());
            if (merchant == null || merchant.getIsDeleted() == 1) {
                throw new BusinessException(4000, "商家不存在");
            }
        } else {
            Food food = foodMapper.selectById(createCollectionDTO.getTargetId());
            if (food == null || food.getIsDeleted() == 1) {
                throw new BusinessException(4000, "菜品不存在");
            }
        }

        // 3. 检查是否已收藏
        LambdaQueryWrapper<Collection> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collection::getUserId, userId);
        wrapper.eq(Collection::getType, createCollectionDTO.getType());
        wrapper.eq(Collection::getTargetId, createCollectionDTO.getTargetId());
        Collection existCollection = collectionMapper.selectOne(wrapper);
        if (existCollection != null) {
            throw new BusinessException(4000, "已收藏，不能重复收藏");
        }

        // 4. 创建收藏
        Collection collection = new Collection();
        collection.setUserId(userId);
        collection.setType(createCollectionDTO.getType());
        collection.setTargetId(createCollectionDTO.getTargetId());
        collectionMapper.insert(collection);

        // 5. 返回收藏ID
        return collection.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelCollection(Long collectionId, Long userId) {
        // 1. 查询收藏是否存在
        Collection collection = collectionMapper.selectById(collectionId);
        if (collection == null || collection.getIsDeleted() == 1) {
            throw new BusinessException(4000, "收藏不存在");
        }

        // 2. 检查是否为收藏者
        if (!collection.getUserId().equals(userId)) {
            throw new BusinessException(4000, "只能取消自己的收藏");
        }

        // 3. 逻辑删除收藏
        collectionMapper.deleteById(collectionId);
    }

    @Override
    public IPage<CollectionVO> getCollectionList(Long userId, Integer current, Integer pageSize, String type) {
        // 1. 构建分页对象
        Page<Collection> page = new Page<>(current != null ? current : 1, pageSize != null ? pageSize : 10);

        // 2. 构建查询条件
        LambdaQueryWrapper<Collection> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collection::getUserId, userId);
        if (type != null) {
            wrapper.eq(Collection::getType, type);
        }
        wrapper.orderByDesc(Collection::getCreateTime);

        // 3. 查询
        IPage<Collection> resultPage = collectionMapper.selectPage(page, wrapper);

        // 4. 获取所有相关ID
        java.util.List<Long> userIds = resultPage.getRecords().stream()
                .map(Collection::getUserId).distinct().collect(Collectors.toList());
        java.util.List<Long> merchantIds = resultPage.getRecords().stream()
                .filter(c -> "MERCHANT".equals(c.getType()))
                .map(Collection::getTargetId).distinct().collect(Collectors.toList());
        java.util.List<Long> foodIds = resultPage.getRecords().stream()
                .filter(c -> "FOOD".equals(c.getType()))
                .map(Collection::getTargetId).distinct().collect(Collectors.toList());

        // 5. 批量查询
        Map<Long, String> usernameMap = userIds.isEmpty() ? Map.of() :
                userMapper.selectBatchIds(userIds).stream()
                        .collect(Collectors.toMap(User::getId, User::getUsername));
        Map<Long, String> avatarMap = userIds.isEmpty() ? Map.of() :
                userProfileMapper.selectList(new LambdaQueryWrapper<UserProfile>()
                                .in(UserProfile::getUserId, userIds)).stream()
                        .collect(Collectors.toMap(UserProfile::getUserId, UserProfile::getAvatar));
        Map<Long, String> shopNameMap = merchantIds.isEmpty() ? Map.of() :
                merchantMapper.selectBatchIds(merchantIds).stream()
                        .collect(Collectors.toMap(Merchant::getId, Merchant::getShopName));
        Map<Long, String> imageMap = merchantIds.isEmpty() ? Map.of() :
                merchantMapper.selectBatchIds(merchantIds).stream()
                        .collect(Collectors.toMap(Merchant::getId, Merchant::getCoverImage));
        Map<Long, String> foodNameMap = foodIds.isEmpty() ? Map.of() :
                foodMapper.selectBatchIds(foodIds).stream()
                        .collect(Collectors.toMap(Food::getId, Food::getName));
        Map<Long, String> foodImageMap = foodIds.isEmpty() ? Map.of() :
                foodMapper.selectBatchIds(foodIds).stream()
                        .collect(Collectors.toMap(Food::getId, Food::getImageUrl));
        Map<Long, BigDecimal> priceMap = foodIds.isEmpty() ? Map.of() :
                foodMapper.selectBatchIds(foodIds).stream()
                        .collect(Collectors.toMap(Food::getId, Food::getPrice));
        Map<Long, BigDecimal> ratingMap = foodIds.isEmpty() ? Map.of() :
                foodMapper.selectBatchIds(foodIds).stream()
                        .collect(Collectors.toMap(Food::getId, Food::getRatingAvg));

        // 6. 转换为VO
        return resultPage.convert(collection -> {
            return CollectionVO.builder()
                    .collectionId(collection.getId())
                    .userId(collection.getUserId())
                    .username(usernameMap.getOrDefault(collection.getUserId(), ""))
                    .avatar(avatarMap.getOrDefault(collection.getUserId(), ""))
                    .type(collection.getType())
                    .targetId(collection.getTargetId())
                    .targetName("MERCHANT".equals(collection.getType()) ?
                            shopNameMap.getOrDefault(collection.getTargetId(), "") :
                            foodNameMap.getOrDefault(collection.getTargetId(), ""))
                    .targetImage("MERCHANT".equals(collection.getType()) ?
                            imageMap.getOrDefault(collection.getTargetId(), "") :
                            foodImageMap.getOrDefault(collection.getTargetId(), ""))
                    .price("FOOD".equals(collection.getType()) ?
                            priceMap.getOrDefault(collection.getTargetId(), null) : null)
                    .ratingAvg("FOOD".equals(collection.getType()) ?
                            ratingMap.getOrDefault(collection.getTargetId(), null) : null)
                    .createTime(collection.getCreateTime().toString())
                    .build();
        });
    }

    @Override
    public Boolean checkCollectionStatus(Long userId, String type, Long targetId) {
        // 1. 构建查询条件
        LambdaQueryWrapper<Collection> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collection::getUserId, userId);
        wrapper.eq(Collection::getType, type);
        wrapper.eq(Collection::getTargetId, targetId);

        // 2. 查询
        Collection collection = collectionMapper.selectOne(wrapper);

        // 3. 返回是否已收藏
        return collection != null;
    }
}
