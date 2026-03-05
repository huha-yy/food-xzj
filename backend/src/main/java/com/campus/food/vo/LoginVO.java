package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 登录响应VO
 */
@Data
@AllArgsConstructor
public class LoginVO {

    private String token;
    private Long userId;
    private String username;
    private String role;
    private String nickname;

    /**
     * 商家ID（仅商家角色时有值）
     */
    private Long merchantId;
}

