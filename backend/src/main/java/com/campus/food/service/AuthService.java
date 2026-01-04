package com.campus.food.service;

import com.campus.food.dto.LoginDTO;
import com.campus.food.dto.RegisterDTO;
import com.campus.food.vo.LoginVO;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户注册
     */
    void register(RegisterDTO registerDTO);

    /**
     * 用户登录
     */
    LoginVO login(LoginDTO loginDTO);
}

