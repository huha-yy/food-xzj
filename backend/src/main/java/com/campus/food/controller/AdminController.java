package com.campus.food.controller;

import com.campus.food.common.result.Result;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.AdminService;
import com.campus.food.vo.StatisticsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 管理员控制器
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "管理员管理", description = "管理员相关接口")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/statistics")
    @Operation(summary = "获取统计数据", description = "获取系统统计数据，包括用户、商家、菜品、评价数量")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<StatisticsVO> getStatistics() {
        StatisticsVO statistics = adminService.getStatistics();
        return Result.success(statistics);
    }
}

