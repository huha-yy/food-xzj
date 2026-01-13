package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.CreateMerchantDTO;
import com.campus.food.dto.MerchantQueryDTO;
import com.campus.food.dto.UpdateMerchantDTO;
import com.campus.food.entity.Merchant;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.service.MerchantService;
import com.campus.food.vo.MerchantVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 商家服务实现
 */
@Service
@RequiredArgsConstructor
public class MerchantServiceImpl extends ServiceImpl<MerchantMapper, Merchant> implements MerchantService {

    private final MerchantMapper merchantMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createMerchant(CreateMerchantDTO createMerchantDTO) {
        // 1. 检查用户是否已创建商家
        LambdaQueryWrapper<Merchant> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Merchant::getUserId, createMerchantDTO.getUserId());
        queryWrapper.eq(Merchant::getIsDeleted, 0);
        Merchant existMerchant = merchantMapper.selectOne(queryWrapper);
        if (existMerchant != null) {
            throw new BusinessException(4004, "您已创建商家，不能重复创建");
        }

        // 2. 创建商家实体
        Merchant merchant = new Merchant();
        merchant.setUserId(createMerchantDTO.getUserId());
        merchant.setShopName(createMerchantDTO.getShopName());
        merchant.setAddress(createMerchantDTO.getAddress());
        merchant.setDescription(createMerchantDTO.getDescription());
        merchant.setCoverImage(createMerchantDTO.getCoverImage());
        merchant.setCoordinateX(createMerchantDTO.getCoordinateX());
        merchant.setCoordinateY(createMerchantDTO.getCoordinateY());
        merchant.setOpeningHours(createMerchantDTO.getOpeningHours());
        merchant.setAuditStatus("PENDING");
        merchant.setStatus("ACTIVE");

        // 3. 插入数据库
        merchantMapper.insert(merchant);

        // 4. 返回商家ID
        return merchant.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMerchant(Long merchantId, UpdateMerchantDTO updateMerchantDTO) {
        // 1. 查询商家是否存在
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || merchant.getIsDeleted() == 1) {
            throw new BusinessException(4005, "商家不存在");
        }

        // 2. 更新商家信息
        if (updateMerchantDTO.getShopName() != null) {
            merchant.setShopName(updateMerchantDTO.getShopName());
        }
        if (updateMerchantDTO.getAddress() != null) {
            merchant.setAddress(updateMerchantDTO.getAddress());
        }
        if (updateMerchantDTO.getDescription() != null) {
            merchant.setDescription(updateMerchantDTO.getDescription());
        }
        if (updateMerchantDTO.getCoverImage() != null) {
            merchant.setCoverImage(updateMerchantDTO.getCoverImage());
        }
        if (updateMerchantDTO.getCoordinateX() != null) {
            merchant.setCoordinateX(updateMerchantDTO.getCoordinateX());
        }
        if (updateMerchantDTO.getCoordinateY() != null) {
            merchant.setCoordinateY(updateMerchantDTO.getCoordinateY());
        }
        if (updateMerchantDTO.getOpeningHours() != null) {
            merchant.setOpeningHours(updateMerchantDTO.getOpeningHours());
        }

        // 3. 更新数据库
        merchantMapper.updateById(merchant);
    }

    @Override
    public MerchantVO getMerchantInfo(Long merchantId) {
        // 1. 查询商家信息
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || merchant.getIsDeleted() == 1) {
            throw new BusinessException(4005, "商家不存在");
        }

        // 2. 构建返回对象
        MerchantVO merchantVO = new MerchantVO();
        merchantVO.setMerchantId(merchant.getId());
        merchantVO.setUserId(merchant.getUserId());
        merchantVO.setShopName(merchant.getShopName());
        merchantVO.setAddress(merchant.getAddress());
        merchantVO.setDescription(merchant.getDescription());
        merchantVO.setCoverImage(merchant.getCoverImage());
        merchantVO.setCoordinateX(merchant.getCoordinateX());
        merchantVO.setCoordinateY(merchant.getCoordinateY());
        merchantVO.setOpeningHours(merchant.getOpeningHours());
        merchantVO.setAuditStatus(merchant.getAuditStatus());
        merchantVO.setStatus(merchant.getStatus());
        merchantVO.setCreateTime(merchant.getCreateTime().toString());
        merchantVO.setUpdateTime(merchant.getUpdateTime().toString());

        return merchantVO;
    }

    @Override
    public MerchantVO getMerchantByUserId(Long userId) {
        // 1. 通过用户ID查询商家信息
        LambdaQueryWrapper<Merchant> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Merchant::getUserId, userId);
        queryWrapper.eq(Merchant::getIsDeleted, 0);
        Merchant merchant = merchantMapper.selectOne(queryWrapper);

        if (merchant == null) {
            throw new BusinessException(4005, "商家不存在");
        }

        // 2. 构建返回对象
        MerchantVO merchantVO = new MerchantVO();
        merchantVO.setMerchantId(merchant.getId());
        merchantVO.setUserId(merchant.getUserId());
        merchantVO.setShopName(merchant.getShopName());
        merchantVO.setAddress(merchant.getAddress());
        merchantVO.setDescription(merchant.getDescription());
        merchantVO.setCoverImage(merchant.getCoverImage());
        merchantVO.setCoordinateX(merchant.getCoordinateX());
        merchantVO.setCoordinateY(merchant.getCoordinateY());
        merchantVO.setOpeningHours(merchant.getOpeningHours());
        merchantVO.setAuditStatus(merchant.getAuditStatus());
        merchantVO.setStatus(merchant.getStatus());
        merchantVO.setCreateTime(merchant.getCreateTime().toString());
        merchantVO.setUpdateTime(merchant.getUpdateTime().toString());

        return merchantVO;
    }

    @Override
    public IPage<MerchantVO> getMerchantList(MerchantQueryDTO merchantQueryDTO) {
        // 1. 构建分页对象
        Page<Merchant> page = new Page<>(merchantQueryDTO.getCurrent(), merchantQueryDTO.getPageSize());

        // 2. 构建查询条件
        LambdaQueryWrapper<Merchant> lambdaQueryWrapper = new LambdaQueryWrapper<>();

        // 3. 按店铺名称模糊查询
        if (merchantQueryDTO.getKeyword() != null && !merchantQueryDTO.getKeyword().isEmpty()) {
            lambdaQueryWrapper.like(Merchant::getShopName, merchantQueryDTO.getKeyword());
        }

        // 4. 按审核状态筛选
        if (merchantQueryDTO.getAuditStatus() != null) {
            lambdaQueryWrapper.eq(Merchant::getAuditStatus, merchantQueryDTO.getAuditStatus());
        }

        // 5. 按状态筛选
        if (merchantQueryDTO.getStatus() != null) {
            lambdaQueryWrapper.eq(Merchant::getStatus, merchantQueryDTO.getStatus());
        }

        // 6. 排序：按创建时间倒序
        lambdaQueryWrapper.orderByDesc(Merchant::getCreateTime);

        // 7. 查询
        IPage<Merchant> resultPage = merchantMapper.selectPage(page, lambdaQueryWrapper);

        // 8. 转换为VO
        return resultPage.convert(merchant -> {
            MerchantVO merchantVO = new MerchantVO();
            merchantVO.setMerchantId(merchant.getId());
            merchantVO.setUserId(merchant.getUserId());
            merchantVO.setShopName(merchant.getShopName());
            merchantVO.setAddress(merchant.getAddress());
            merchantVO.setDescription(merchant.getDescription());
            merchantVO.setCoverImage(merchant.getCoverImage());
            merchantVO.setCoordinateX(merchant.getCoordinateX());
            merchantVO.setCoordinateY(merchant.getCoordinateY());
            merchantVO.setOpeningHours(merchant.getOpeningHours());
            merchantVO.setAuditStatus(merchant.getAuditStatus());
            merchantVO.setStatus(merchant.getStatus());
            merchantVO.setCreateTime(merchant.getCreateTime().toString());
            merchantVO.setUpdateTime(merchant.getUpdateTime().toString());
            return merchantVO;
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void auditMerchant(Long merchantId, String auditStatus, String auditReason) {
        // 1. 查询商家
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || merchant.getIsDeleted() == 1) {
            throw new BusinessException(4005, "商家不存在");
        }

        // 2. 检查审核状态
        if (!"PENDING".equals(merchant.getAuditStatus())) {
            throw new BusinessException(4006, "商家已审核，无法重复审核");
        }

        // 3. 更新审核状态和理由
        merchant.setAuditStatus(auditStatus);

        // 5. 更新数据库
        merchantMapper.updateById(merchant);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMerchantStatus(Long merchantId, String status) {
        // 1. 查询商家
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || merchant.getIsDeleted() == 1) {
            throw new BusinessException(4005, "商家不存在");
        }

        // 2. 校验状态值
        if (!"ACTIVE".equals(status) && !"DISABLED".equals(status)) {
            throw new BusinessException(4000, "状态值不正确");
        }

        // 3. 更新状态
        merchant.setStatus(status);
        merchantMapper.updateById(merchant);
    }
}
