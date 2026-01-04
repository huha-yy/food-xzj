# 校园美食评价系统 - 后端

## 项目简介

基于SpringBoot 3.x的大学生校内美食评价系统后端项目。

## 技术栈

- SpringBoot 3.2.0
- Spring Security + JWT
- MyBatis-Plus 3.5.5
- MySQL 8.0
- Knife4j 4.3.0
- JDK 17

## 项目结构

```
backend/
├── src/main/java/com/campus/food/
│   ├── CampusFoodApplication.java    # 启动类
│   ├── controller/                   # 控制器层
│   ├── service/                      # 业务层
│   ├── mapper/                       # 数据访问层
│   ├── entity/                       # 实体类
│   ├── dto/                          # 数据传输对象
│   ├── vo/                           # 视图对象
│   ├── config/                        # 配置类
│   ├── common/                        # 公共模块
│   └── security/                      # 安全模块
└── src/main/resources/
    ├── application.yml               # 配置文件
    └── static/                       # 静态资源
```

## 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+

## 快速开始

### 1. 数据库准备

```sql
-- 执行建表SQL
mysql -u root -p < sql/campus_food_schema.sql

-- 执行初始化数据SQL（可选）
mysql -u root -p < sql/campus_food_init_data.sql
```

### 2. 配置数据库

修改 `application.yml` 中的数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/campus_food
    username: root
    password: your_password
```

### 3. 运行项目

```bash
# 方式1：使用Maven运行
mvn spring-boot:run

# 方式2：使用IDE运行
找到 CampusFoodApplication.java，右键运行
```

### 4. 访问接口文档

项目启动成功后，访问：
- Knife4j文档：http://localhost:8080/doc.html

## 开发说明

### 端口配置

- 后端服务端口：8080
- 可在 `application.yml` 中修改

### 文件上传

- 上传路径：`src/main/resources/static/uploads/`
- 最大文件大小：5MB
- 支持格式：jpg、jpeg、png

### JWT配置

- Token有效期：30天
- 可在 `application.yml` 中修改

## 注意事项

- 密码使用BCrypt加密
- 所有删除操作使用逻辑删除
- 不使用数据库外键，在代码层面控制数据一致性
- 数据库字符集：utf8mb4

