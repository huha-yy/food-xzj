package com.campus.food.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.food.dto.UpdateUserDTO;
import com.campus.food.dto.UserQueryDTO;
import com.campus.food.entity.User;
import com.campus.food.vo.UserVO;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 查询用户列表
     */
    IPage<UserVO> getUserList(UserQueryDTO userQueryDTO);

    /**
     * 查询用户信息
     */
    UserVO getUserInfo(Long userId);

    /**
     * 修改用户信息
     */
    void updateUserInfo(Long userId, UpdateUserDTO updateUserDTO);

    /**
     * 修改密码
     */
    void updatePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 禁用/启用用户
     */
    void updateUserStatus(Long userId, String status);
}

