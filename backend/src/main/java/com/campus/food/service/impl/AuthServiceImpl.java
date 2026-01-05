package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.food.dto.LoginDTO;
import com.campus.food.dto.RegisterDTO;
import com.campus.food.entity.User;
import com.campus.food.entity.UserProfile;
import com.campus.food.exception.BusinessException;
import com.campus.food.mapper.UserMapper;
import com.campus.food.mapper.UserProfileMapper;
import com.campus.food.security.SecurityUser;
import com.campus.food.service.AuthService;
import com.campus.food.utils.JwtUtil;
import com.campus.food.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 认证服务实现
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(RegisterDTO registerDTO) {
        // 1. 检查用户名是否已存在
        User existUser = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, registerDTO.getUsername())
                        .eq(User::getIsDeleted, 0)
        );
        if (existUser != null) {
            throw new BusinessException(4001, "用户名已存在");
        }

        // 2. 检查学号是否已存在（如果是学生）
        if ("STUDENT".equals(registerDTO.getRole())) {
            UserProfile existProfile = userProfileMapper.selectOne(
                            new LambdaQueryWrapper<UserProfile>()
                                    .eq(UserProfile::getStudentNo, registerDTO.getStudentNo())
                                    .eq(UserProfile::getIsDeleted, 0)
            );
            if (existProfile != null) {
                throw new BusinessException(4001, "学号已存在");
            }
        }

        // 3. 密码加密
        String encodedPassword = passwordEncoder.encode(registerDTO.getPassword());

        // 4. 创建用户
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPasswordHash(encodedPassword);
        user.setRole(registerDTO.getRole());
        user.setStatus("ACTIVE");
        userMapper.insert(user);

        // 5. 如果是学生，创建用户资料
        if ("STUDENT".equals(registerDTO.getRole())) {
            UserProfile profile = new UserProfile();
            profile.setUserId(user.getId());
            profile.setNickname(registerDTO.getUsername());
            profile.setPhone(registerDTO.getPhone());
            if (registerDTO.getStudentNo() != null) {
                profile.setStudentNo(registerDTO.getStudentNo());
            }
            userProfileMapper.insert(profile);
        } else if ("MERCHANT".equals(registerDTO.getRole())) {
            // 商家也可以创建资料
            UserProfile profile = new UserProfile();
            profile.setUserId(user.getId());
            profile.setNickname(registerDTO.getUsername());
            profile.setPhone(registerDTO.getPhone());
            userProfileMapper.insert(profile);
        }
    }

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        // 1. 查询用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, loginDTO.getUsername())
                        .eq(User::getIsDeleted, 0)
        );
        if (user == null) {
            throw new BusinessException(4011, "用户不存在");
        }

        // 2. 验证密码
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(4012, "密码错误");
        }

        // 3. 检查用户状态
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BusinessException(4013, "用户已禁用");
        }

        // 4. 生成Token
        String token = jwtUtil.generateToken(user.getUsername());

        // 5. 查询用户资料（获取昵称）
        UserProfile profile = userProfileMapper.selectOne(
                        new LambdaQueryWrapper<UserProfile>()
                                .eq(UserProfile::getUserId, user.getId())
                                .eq(UserProfile::getIsDeleted, 0)
        );
        String nickname = profile != null ? profile.getNickname() : user.getUsername();

        // 6. 返回登录信息
        return new LoginVO(token, user.getId(), user.getUsername(), user.getRole(), nickname);
    }
}

