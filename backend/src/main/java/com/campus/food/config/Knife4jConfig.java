package com.campus.food.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springdoc.core.properties.SpringDocConfigProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j配置类
 */
@Configuration
@ConditionalOnProperty(name = "knife4j.enable", havingValue = "true")
public class Knife4jConfig {

    /**
     * OpenAPI配置
     */
    @Bean
    public OpenAPI customOpenAPI(SpringDocConfigProperties springDocConfigProperties) {
        return new OpenAPI()
                .info(new Info()
                        .title("校园美食评价系统API文档")
                        .description("基于SpringBoot的校园美食评价系统接口文档")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("开发者")
                                .email("example@example.com")));
    }
}

