package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.AnnouncementQueryDTO;
import com.campus.food.dto.CreateAnnouncementDTO;
import com.campus.food.dto.UpdateAnnouncementDTO;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.AnnouncementService;
import com.campus.food.vo.AnnouncementVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 公告管理控制器
 */
@Tag(name = "公告管理", description = "公告管理相关接口")
@RestController
@RequestMapping("/api/announcement")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Operation(summary = "创建公告")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Result<Long> createAnnouncement(@Valid @RequestBody CreateAnnouncementDTO createAnnouncementDTO,
                                            @AuthenticationPrincipal SecurityUser securityUser) {
        Long announcementId = announcementService.createAnnouncement(createAnnouncementDTO, securityUser.getUserId());
        return Result.success(announcementId);
    }

    @Operation(summary = "修改公告")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public Result<Void> updateAnnouncement(@Valid @RequestBody UpdateAnnouncementDTO updateAnnouncementDTO,
                                           @AuthenticationPrincipal SecurityUser securityUser) {
        announcementService.updateAnnouncement(updateAnnouncementDTO, securityUser.getUserId());
        return Result.success();
    }

    @Operation(summary = "删除公告")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public Result<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return Result.success();
    }

    @Operation(summary = "查询公告详情")
    @GetMapping("/{id}")
    public Result<AnnouncementVO> getAnnouncementDetail(@PathVariable Long id) {
        AnnouncementVO announcementVO = announcementService.getAnnouncementDetail(id);
        return Result.success(announcementVO);
    }

    @Operation(summary = "查询公告列表")
    @GetMapping("/list")
    public Result<IPage<AnnouncementVO>> getAnnouncementList(AnnouncementQueryDTO announcementQueryDTO) {
        IPage<AnnouncementVO> announcementVOPage = announcementService.getAnnouncementList(announcementQueryDTO);
        return Result.success(announcementVOPage);
    }

    @Operation(summary = "发布公告")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/publish/{id}")
    public Result<Void> publishAnnouncement(@PathVariable Long id, @AuthenticationPrincipal SecurityUser securityUser) {
        announcementService.publishAnnouncement(id, securityUser.getUserId());
        return Result.success();
    }
}

