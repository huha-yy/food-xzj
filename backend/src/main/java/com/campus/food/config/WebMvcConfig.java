package com.campus.food.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

/**
 * Web MVC 配置类
 * 用于配置静态资源处理
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * 配置静态资源处理器
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置上传的静态资源映射
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/")
                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic());
    }
}

