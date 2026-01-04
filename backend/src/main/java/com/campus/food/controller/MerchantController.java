package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateMerchantDTO;
import com.campus.food.dto.UpdateMerchantDTO;
import com.campus.food.dto.MerchantQueryDTO;
import com.campus.food.dto.MerchantAuditDTO;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.MerchantService;
import com.campus.food.vo.MerchantVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 商家管理Controller
 */
@RestController
@RequestMapping("/api/merchants")
@RequiredArgsConstructor
@Tag(name = "商家管理", description = "商家相关接口")
public class MerchantController {

    private final MerchantService merchantService;

    @PostMapping
    @Operation(summary = "创建商家")
    public Result<Long> createMerchant(
            @RequestBody CreateMerchantDTO createMerchantDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        createMerchantDTO.setUserId(securityUser.getUserId());
        Long merchantId = merchantService.createMerchant(createMerchantDTO);
        return Result.success(merchantId);
    }

    @PutMapping("/{merchantId}")
    @Operation(summary = "修改商家信息")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public Result<Void> updateMerchant(
            @PathVariable Long merchantId,
            @RequestBody UpdateMerchantDTO updateMerchantDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        merchantService.updateMerchant(merchantId, updateMerchantDTO);
        return Result.success();
    }

    @GetMapping("/{merchantId}")
    @Operation(summary = "查询商家信息")
    public Result<MerchantVO> getMerchantInfo(@PathVariable Long merchantId) {
        MerchantVO merchantVO = merchantService.getMerchantInfo(merchantId);
        return Result.success(merchantVO);
    }

    @GetMapping("/list")
    @Operation(summary = "商家列表查询")
    public Result<IPage<MerchantVO>> getMerchantList(MerchantQueryDTO merchantQueryDTO) {
        IPage<MerchantVO> page = merchantService.getMerchantList(merchantQueryDTO);
        return Result.success(page);
    }

    @PostMapping("/audit")
    @Operation(summary = "商家审核")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> auditMerchant(
            @RequestBody MerchantAuditDTO auditDTO
    ) {
        merchantService.auditMerchant(auditDTO.getMerchantId(), auditDTO.getAuditStatus(), auditDTO.getAuditReason());
        return Result.success();
    }

    @PutMapping("/{merchantId}/status")
    @Operation(summary = "商家状态管理")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateMerchantStatus(
            @PathVariable Long merchantId,
            @RequestParam String status
    ) {
        merchantService.updateMerchantStatus(merchantId, status);
        return Result.success();
    }
}

