package com.campus.food.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.common.result.Result;
import com.campus.food.dto.UpdateUserDTO;
import com.campus.food.dto.UserQueryDTO;
import com.campus.food.service.UserService;
import com.campus.food.security.SecurityUser;
import com.campus.food.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户信息查询、修改、密码修改、禁用/启用等接口")
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    @Operation(summary = "查询用户列表", description = "管理员查询用户列表，支持分页和筛选")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<IPage<UserVO>> getUserList(UserQueryDTO userQueryDTO) {
        IPage<UserVO> userVOPage = userService.getUserList(userQueryDTO);
        return Result.success(userVOPage);
    }

    @GetMapping("/info")
    @Operation(summary = "查询用户信息", description = "根据用户ID查询用户信息和资料")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'MERCHANT')")
    public Result<UserVO> getUserInfo(@RequestParam Long userId) {
        UserVO userVO = userService.getUserInfo(userId);
        return Result.success(userVO);
    }

    @PutMapping("/info")
    @Operation(summary = "修改用户信息", description = "修改用户昵称、头像、手机号等资料")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'MERCHANT')")
    public Result<Void> updateUserInfo(@AuthenticationPrincipal SecurityUser securityUser,
                                      @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        userService.updateUserInfo(securityUser.getUserId(), updateUserDTO);
        return Result.success("修改成功");
    }

    @PutMapping("/password")
    @Operation(summary = "修改密码", description = "用户修改自己的密码")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'MERCHANT')")
    public Result<Void> updatePassword(@AuthenticationPrincipal SecurityUser securityUser,
                                        @RequestParam String oldPassword,
                                        @RequestParam String newPassword) {
        userService.updatePassword(securityUser.getUserId(), oldPassword, newPassword);
        return Result.success("修改成功");
    }

    @PutMapping("/status")
    @Operation(summary = "禁用/启用用户", description = "管理员禁用或启用用户账号")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateUserStatus(@RequestParam Long userId,
                                         @RequestParam String status) {
        userService.updateUserStatus(userId, status);
        return Result.success("操作成功");
    }
}

