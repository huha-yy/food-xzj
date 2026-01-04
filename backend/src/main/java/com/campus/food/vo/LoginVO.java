package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 登录响应VO
 */
@Data
@AllArgsConstructor
public class LoginVO {

    /**
     * Token
     */
    private String token;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 角色
     */
    private String role;

    /**
     * 昵称
     */
    private String nickname;
}

