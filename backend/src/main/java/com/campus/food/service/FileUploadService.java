package com.campus.food.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传服务接口
 */
public interface FileUploadService {

    /**
     * 上传图片
     */
    String uploadImage(MultipartFile file);

    /**
     * 删除图片
     */
    void deleteImage(String imageUrl);
}

