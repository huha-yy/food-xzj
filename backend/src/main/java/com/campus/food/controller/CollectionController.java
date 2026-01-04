package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.CreateCollectionDTO;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.CollectionService;
import com.campus.food.vo.CollectionVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 收藏管理Controller
 */
@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
@Tag(name = "收藏管理", description = "收藏相关接口")
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    @Operation(summary = "添加收藏")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Long> addCollection(
            @RequestBody CreateCollectionDTO createCollectionDTO,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        Long collectionId = collectionService.addCollection(createCollectionDTO, securityUser.getUserId());
        return Result.success(collectionId);
    }

    @DeleteMapping("/{collectionId}")
    @Operation(summary = "取消收藏")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Void> cancelCollection(
            @PathVariable Long collectionId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        collectionService.cancelCollection(collectionId, securityUser.getUserId());
        return Result.success();
    }

    @GetMapping("/list")
    @Operation(summary = "收藏列表查询")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<IPage<CollectionVO>> getCollectionList(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String type,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        IPage<CollectionVO> page = collectionService.getCollectionList(
                securityUser.getUserId(), current, pageSize, type);
        return Result.success(page);
    }

    @GetMapping("/check")
    @Operation(summary = "检查收藏状态")
    @PreAuthorize("hasRole('STUDENT')")
    public Result<Boolean> checkCollectionStatus(
            @RequestParam String type,
            @RequestParam Long targetId,
            @AuthenticationPrincipal SecurityUser securityUser
    ) {
        Boolean isCollected = collectionService.checkCollectionStatus(
                securityUser.getUserId(), type, targetId);
        return Result.success(isCollected);
    }
}

