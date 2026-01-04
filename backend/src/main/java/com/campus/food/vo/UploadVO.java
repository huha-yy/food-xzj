package com.campus.food.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 上传响应VO
 */
@Data
@AllArgsConstructor
public class UploadVO {

    /**
     * 图片URL
     */
    private String imageUrl;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;
}

