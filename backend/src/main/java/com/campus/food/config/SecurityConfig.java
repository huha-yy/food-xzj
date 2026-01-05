package com.campus.food.config;

import com.campus.food.security.CustomUserDetailsService;
import com.campus.food.security.JwtAuthenticationFilter;
import com.campus.food.security.SecurityUser;
import com.campus.food.utils.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import lombok.RequiredArgsConstructor;

/**
 * Spring Security配置类
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    /**
     * 密码加密器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证管理器
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    /**
     * Security过滤器链配置
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF
                .csrf(csrf -> csrf.disable())
                // 无状态会话（使用JWT）
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置请求授权
                .authorizeHttpRequests(auth -> auth
                        // 允许匿名访问的接口
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                // 公开API：菜品列表、推荐接口等（首页展示用）
                                "/api/foods/**",
                                "/api/recommend/**",
                                "/api/merchants/**",
                                // 评价相关接口（需要认证，但由@PreAuthorize控制）
                                "/api/reviews/**",
                                // 公告相关接口（需要认证，但由@PreAuthorize控制）
                                "/api/announcement/**",
                                // 活动相关接口（需要认证，但由@PreAuthorize控制）
                                "/api/activity/**",
                                // 收藏相关接口（需要认证，但由@PreAuthorize控制）
                                "/api/collections/**",
                                // 文件上传接口（需要认证）
                                "/api/upload/**",
                                // 用户相关接口（需要认证，但由@PreAuthorize控制）
                                "/api/user/**",
                                // 管理员接口（需要认证，但由@PreAuthorize控制）
                                "/api/admin/**",
                                // Swagger UI and Knife4j 相关路径
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs/swagger-config",
                                "/doc.html",
                                "/webjars/**",
                                "/favicon.ico"
                        ).permitAll()
                        // 其他请求需要认证
                        .anyRequest().authenticated()
                )
                // 添加JWT过滤器到过滤器链（在UsernamePasswordAuthenticationFilter之前）
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * JWT认证过滤器
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(customUserDetailsService, jwtUtil);
    }
}
