package com.campus.food.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 修改用户信息DTO
 */
@Data
public class UpdateUserDTO {

    /**
     * 昵称
     */
    @Size(max = 32, message = "昵称长度不能超过32位")
    private String nickname;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 手机号
     */
    private String phone;
}

