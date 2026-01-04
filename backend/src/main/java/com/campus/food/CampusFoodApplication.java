package com.campus.food;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 校园美食评价系统启动类
 */
@SpringBootApplication
@MapperScan("com.campus.food.mapper")
public class CampusFoodApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusFoodApplication.class, args);
        System.out.println("\n" +
                "=========================================\n" +
                "  🚀 校园美食评价系统后端启动成功！\n" +
                "=========================================\n" +
                "  📖 API文档地址: http://localhost:8080/doc.html\n" +
                "  🔧 Swagger UI:  http://localhost:8080/swagger-ui.html\n" +
                "  🌐 服务地址:    http://localhost:8080\n" +
                "=========================================\n");
    }
}

