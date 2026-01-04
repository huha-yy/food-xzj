package com.campus.food.controller;

import com.campus.food.common.result.Result;
import com.campus.food.service.FileUploadService;
import com.campus.food.vo.UploadVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传控制器
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Tag(name = "文件上传", description = "图片上传、删除等接口")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/image")
    @Operation(summary = "上传图片", description = "上传图片到本地服务器")
    public Result<UploadVO> uploadImage(@Valid @RequestParam("file") MultipartFile file) {
        String imageUrl = fileUploadService.uploadImage(file);
        
        // 构造响应
        UploadVO uploadVO = new UploadVO(imageUrl, file.getOriginalFilename(), file.getSize());
        return Result.success(uploadVO);
    }

    @DeleteMapping("/image")
    @Operation(summary = "删除图片", description = "删除本地服务器的图片")
    public Result<Void> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        fileUploadService.deleteImage(imageUrl);
        return Result.success("删除成功");
    }
}

