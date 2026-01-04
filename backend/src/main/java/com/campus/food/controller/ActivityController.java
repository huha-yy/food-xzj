package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.ActivityAuditDTO;
import com.campus.food.dto.ActivityQueryDTO;
import com.campus.food.dto.CreateActivityDTO;
import com.campus.food.dto.UpdateActivityDTO;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.ActivityService;
import com.campus.food.vo.ActivityVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 活动管理控制器
 */
@Tag(name = "活动管理", description = "活动管理相关接口")
@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @Operation(summary = "创建活动")
    @PreAuthorize("hasRole('MERCHANT')")
    @PostMapping
    public Result<Long> createActivity(@Valid @RequestBody CreateActivityDTO createActivityDTO,
                                     @AuthenticationPrincipal SecurityUser securityUser) {
        Long activityId = activityService.createActivity(createActivityDTO, securityUser.getUserId());
        return Result.success(activityId);
    }

    @Operation(summary = "修改活动")
    @PreAuthorize("hasRole('MERCHANT')")
    @PutMapping
    public Result<Void> updateActivity(@Valid @RequestBody UpdateActivityDTO updateActivityDTO) {
        activityService.updateActivity(updateActivityDTO);
        return Result.success();
    }

    @Operation(summary = "删除活动")
    @PreAuthorize("hasRole('MERCHANT')")
    @DeleteMapping("/{id}")
    public Result<Void> deleteActivity(@PathVariable Long id,
                                     @AuthenticationPrincipal SecurityUser securityUser) {
        activityService.deleteActivity(id, securityUser.getUserId());
        return Result.success();
    }

    @Operation(summary = "查询活动详情")
    @GetMapping("/{id}")
    public Result<ActivityVO> getActivityDetail(@PathVariable Long id) {
        ActivityVO activityVO = activityService.getActivityDetail(id);
        return Result.success(activityVO);
    }

    @Operation(summary = "查询活动列表")
    @GetMapping("/list")
    public Result<IPage<ActivityVO>> getActivityList(ActivityQueryDTO activityQueryDTO) {
        IPage<ActivityVO> activityVOPage = activityService.getActivityList(activityQueryDTO);
        return Result.success(activityVOPage);
    }

    @Operation(summary = "活动审核")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/audit")
    public Result<Void> auditActivity(@Valid @RequestBody ActivityAuditDTO activityAuditDTO,
                                     @AuthenticationPrincipal SecurityUser securityUser) {
        activityService.auditActivity(activityAuditDTO, securityUser.getUserId());
        return Result.success();
    }

    @Operation(summary = "添加活动图片")
    @PreAuthorize("hasRole('MERCHANT')")
    @PostMapping("/{activityId}/images")
    public Result<Void> addActivityImage(@PathVariable Long activityId,
                                         @RequestParam String imageUrl,
                                         @AuthenticationPrincipal SecurityUser securityUser) {
        activityService.addActivityImage(activityId, imageUrl, securityUser.getUserId());
        return Result.success();
    }

    @Operation(summary = "删除活动图片")
    @PreAuthorize("hasRole('MERCHANT')")
    @DeleteMapping("/images/{imageId}")
    public Result<Void> deleteActivityImage(@PathVariable Long imageId,
                                          @AuthenticationPrincipal SecurityUser securityUser) {
        activityService.deleteActivityImage(imageId, securityUser.getUserId());
        return Result.success();
    }
}

