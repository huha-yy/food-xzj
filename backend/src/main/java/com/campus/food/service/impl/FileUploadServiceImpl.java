package com.campus.food.service.impl;

import com.campus.food.exception.BusinessException;
import com.campus.food.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * 文件上传服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${file.upload.path}")
    private String uploadPath;

    /**
     * 图片上传路径
     */
    private static final String IMAGE_UPLOAD_PATH = "/uploads/images/";

    @Override
    public String uploadImage(MultipartFile file) {
        // 1. 校验文件
        if (file == null || file.isEmpty()) {
            throw new BusinessException(4017, "文件不能为空");
        }

        // 2. 校验文件大小（5MB）
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new BusinessException(4017, "文件大小不能超过5MB");
        }

        // 3. 校验文件格式
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BusinessException(4018, "文件名不能为空");
        }

        String fileExtension = getFileExtension(originalFilename);
        if (!isImageFile(fileExtension)) {
            throw new BusinessException(4018, "只支持jpg、jpeg、png格式");
        }

        try {
            // 4. 生成新文件名
            String newFilename = generateFilename(originalFilename);

            // 5. 创建目标目录
            File targetDirectory = new File(uploadPath + IMAGE_UPLOAD_PATH);
            if (!targetDirectory.exists()) {
                targetDirectory.mkdirs();
            }

            // 6. 保存文件
            Path targetPath = Paths.get(targetDirectory.getAbsolutePath(), newFilename);
            Files.copy(file.getInputStream(), targetPath);

            // 7. 返回文件访问URL
            String fileUrl = IMAGE_UPLOAD_PATH + newFilename;
            log.info("文件上传成功：{}", fileUrl);
            return fileUrl;
        } catch (IOException e) {
            log.error("文件上传失败：", e);
            throw new BusinessException(5001, "文件上传失败");
        }
    }

    @Override
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            throw new BusinessException(4000, "图片URL不能为空");
        }

        try {
            // 1. 从URL中提取文件名
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            // 2. 构建完整文件路径
            String fullPath = uploadPath + imageUrl;
            File file = new File(fullPath);

            // 3. 删除文件
            if (file.exists()) {
                boolean deleted = file.delete();
                if (deleted) {
                    log.info("文件删除成功：{}", imageUrl);
                } else {
                    log.warn("文件删除失败：{}", imageUrl);
                }
            } else {
                log.warn("文件不存在：{}", imageUrl);
            }
        } catch (Exception e) {
            log.error("删除文件失败：", e);
            throw new BusinessException(5001, "删除文件失败");
        }
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }

    /**
     * 校验是否为图片文件
     */
    private boolean isImageFile(String extension) {
        return "jpg".equals(extension) ||
               "jpeg".equals(extension) ||
               "png".equals(extension);
    }

    /**
     * 生成唯一文件名
     */
    private String generateFilename(String originalFilename) {
        // 1. 获取文件扩展名
        String extension = getFileExtension(originalFilename);

        // 2. 生成UUID作为文件名
        String uuid = UUID.randomUUID().toString().replace("-", "");

        // 3. 获取日期作为前缀
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 4. 组合文件名
        return datePrefix + "_" + uuid + "." + extension;
    }
}

