package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.food.dto.UpdateUserDTO;
import com.campus.food.dto.UserQueryDTO;
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
import org.springframework.util.StringUtils;

/**
 * 用户服务实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public IPage<UserVO> getUserList(UserQueryDTO userQueryDTO) {
        // 1. 构建分页对象
        Page<User> page = new Page<>(
                userQueryDTO.getCurrent() != null ? userQueryDTO.getCurrent() : 1,
                userQueryDTO.getPageSize() != null ? userQueryDTO.getPageSize() : 10
        );

        // 2. 构建查询条件
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        
        // 按用户名模糊查询
        if (StringUtils.hasText(userQueryDTO.getKeyword())) {
            wrapper.like(User::getUsername, userQueryDTO.getKeyword());
        }
        
        // 按角色筛选
        if (StringUtils.hasText(userQueryDTO.getRole())) {
            wrapper.eq(User::getRole, userQueryDTO.getRole());
        }
        
        // 按状态筛选
        if (StringUtils.hasText(userQueryDTO.getStatus())) {
            wrapper.eq(User::getStatus, userQueryDTO.getStatus());
        }
        
        // 按创建时间倒序
        wrapper.orderByDesc(User::getCreateTime);

        // 3. 查询用户列表
        IPage<User> resultPage = userMapper.selectPage(page, wrapper);

        // 4. 转换为UserVO
        return resultPage.convert(user -> UserVO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .nickname(user.getUsername())
                .avatar(null)
                .phone(null)
                .studentNo(null)
                .createTime(user.getCreateTime().toString())
                .updateTime(user.getUpdateTime().toString())
                .build()
        );
    }

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
            // 使用 LambdaUpdateWrapper 更新字段，避免创建新对象
            LambdaUpdateWrapper<UserProfile> updateWrapper = new LambdaUpdateWrapper<UserProfile>()
                    .eq(UserProfile::getUserId, userId);

            if (updateUserDTO.getNickname() != null) {
                updateWrapper.set(UserProfile::getNickname, updateUserDTO.getNickname());
            }
            if (updateUserDTO.getAvatar() != null) {
                updateWrapper.set(UserProfile::getAvatar, updateUserDTO.getAvatar());
            }
            if (updateUserDTO.getPhone() != null) {
                updateWrapper.set(UserProfile::getPhone, updateUserDTO.getPhone());
            }

            userProfileMapper.update(null, updateWrapper);
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

