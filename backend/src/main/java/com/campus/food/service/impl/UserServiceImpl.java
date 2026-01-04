package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.food.dto.UpdateUserDTO;
import com.campus.food.entity.User;
import com.campus.food.entity.UserProfile;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.UserMapper;
import com.campus.food.mapper.UserProfileMapper;
import com.campus.food.service.UserService;
import com.campus.food.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVO getUserInfo(Long userId) {
        // 1. 查询用户基本信息
        User user = userMapper.selectById(userId);
        if (user == null || user.getIsDeleted() == 1) {
            throw new BusinessException(4003, "用户不存在");
        }

        // 2. 查询用户资料
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>()
                        .eq(UserProfile::getUserId, userId)
                        .eq(UserProfile::getIsDeleted, 0)
        );

        // 3. 组装返回数据
        UserVO userVO = UserVO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .nickname(profile != null ? profile.getNickname() : user.getUsername())
                .avatar(profile != null ? profile.getAvatar() : null)
                .phone(profile != null ? profile.getPhone() : null)
                .studentNo(profile != null ? profile.getStudentNo() : null)
                .createTime(user.getCreateTime().toString())
                .updateTime(user.getUpdateTime().toString())
                .build();

        return userVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUserInfo(Long userId, UpdateUserDTO updateUserDTO) {
        // 1. 校验用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null || user.getIsDeleted() == 1) {
            throw new BusinessException(4003, "用户不存在");
        }

        // 2. 查询用户资料是否存在
        LambdaQueryWrapper<UserProfile> wrapper = new LambdaQueryWrapper<UserProfile>()
                .eq(UserProfile::getUserId, userId)
                .eq(UserProfile::getIsDeleted, 0);
        UserProfile existProfile = userProfileMapper.selectOne(wrapper);

        if (existProfile == null) {
            // 资料不存在则创建
            UserProfile profile = new UserProfile();
            profile.setUserId(userId);
            profile.setNickname(updateUserDTO.getNickname());
            profile.setAvatar(updateUserDTO.getAvatar());
            profile.setPhone(updateUserDTO.getPhone());
            userProfileMapper.insert(profile);
        } else {
            // 资料存在则更新
            UserProfile profile = new UserProfile();
            profile.setUserId(userId);
            if (updateUserDTO.getNickname() != null) {
                profile.setNickname(updateUserDTO.getNickname());
            }
            if (updateUserDTO.getAvatar() != null) {
                profile.setAvatar(updateUserDTO.getAvatar());
            }
            if (updateUserDTO.getPhone() != null) {
                profile.setPhone(updateUserDTO.getPhone());
            }
            userProfileMapper.updateById(profile);
        }

        // 3. 更新user表的updaterId和updateTime
        user.setUpdaterId(userId);
        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        // 1. 查询用户
        User user = userMapper.selectById(userId);
        if (user == null || user.getIsDeleted() == 1) {
            throw new BusinessException(4003, "用户不存在");
        }

        // 2. 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new BusinessException(4017, "旧密码错误");
        }

        // 3. 加密新密码
        String encodedPassword = passwordEncoder.encode(newPassword);

        // 4. 更新密码
        user.setPasswordHash(encodedPassword);
        user.setUpdaterId(userId);
        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUserStatus(Long userId, String status) {
        // 1. 校验用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null || user.getIsDeleted() == 1) {
            throw new BusinessException(4003, "用户不存在");
        }

        // 2. 校验状态值
        if (!"ACTIVE".equals(status) && !"DISABLED".equals(status)) {
            throw new BusinessException(4000, "状态值不正确");
        }

        // 3. 更新用户状态
        user.setStatus(status);
        user.setUpdaterId(userId);
        userMapper.updateById(user);
    }
}

