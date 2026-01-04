package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.CreateMerchantDTO;
import com.campus.food.dto.MerchantQueryDTO;
import com.campus.food.dto.UpdateMerchantDTO;
import com.campus.food.vo.MerchantVO;

/**
 * 商家服务接口
 */
public interface MerchantService {

    /**
     * 创建商家
     */
    Long createMerchant(CreateMerchantDTO createMerchantDTO);

    /**
     * 修改商家信息
     */
    void updateMerchant(Long merchantId, UpdateMerchantDTO updateMerchantDTO);

    /**
     * 查询商家信息
     */
    MerchantVO getMerchantInfo(Long merchantId);

    /**
     * 商家列表查询
     */
    IPage<MerchantVO> getMerchantList(MerchantQueryDTO merchantQueryDTO);

    /**
     * 商家审核
     */
    void auditMerchant(Long merchantId, String auditStatus, String auditReason);

    /**
     * 商家状态管理
     */
    void updateMerchantStatus(Long merchantId, String status);
}

