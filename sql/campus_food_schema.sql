-- =====================================================
-- 大学生校内美食评价系统 - 数据库建表SQL
-- 数据库: campus_food
-- MySQL版本: 8.0
-- 字符集: utf8mb4
-- =====================================================

-- 建库
CREATE DATABASE IF NOT EXISTS `campus_food` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `campus_food`;

SET NAMES utf8mb4;

-- =====================================================
-- 1. user - 用户基础表
-- =====================================================
CREATE TABLE `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` VARCHAR(32) NOT NULL COMMENT '登录用户名',
  `password_hash` VARCHAR(256) NOT NULL COMMENT '密码哈希(BCrypt)',
  `role` ENUM('STUDENT','MERCHANT','ADMIN') NOT NULL COMMENT '角色',
  `status` ENUM('ACTIVE','DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础表';

-- =====================================================
-- 2. user_profile - 用户资料表
-- =====================================================
CREATE TABLE `user_profile` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `nickname` VARCHAR(32) NULL COMMENT '昵称',
  `avatar` VARCHAR(256) NULL COMMENT '头像URL',
  `phone` VARCHAR(16) NULL COMMENT '手机号',
  `student_no` VARCHAR(16) NULL COMMENT '学号(学生)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表';

-- =====================================================
-- 3. merchant - 商家表
-- =====================================================
CREATE TABLE `merchant` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关联用户ID(MERCHANT角色)',
  `shop_name` VARCHAR(64) NOT NULL COMMENT '店铺名称',
  `address` VARCHAR(256) NULL COMMENT '店铺地址',
  `description` TEXT NULL COMMENT '店铺描述',
  `cover_image` VARCHAR(256) NULL COMMENT '封面图URL',
  `coordinate_x` DECIMAL(10,6) NULL COMMENT '坐标X',
  `coordinate_y` DECIMAL(10,6) NULL COMMENT '坐标Y',
  `opening_hours` VARCHAR(64) NULL COMMENT '营业时间',
  `audit_status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
  `status` ENUM('ACTIVE','DISABLED') NOT NULL DEFAULT 'ACTIVE' COMMENT '店铺状态',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

-- =====================================================
-- 4. category - 分类表
-- =====================================================
CREATE TABLE `category` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(32) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(256) NULL COMMENT '分类描述',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序(数字越小越靠前)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- =====================================================
-- 5. food - 菜品表
-- =====================================================
CREATE TABLE `food` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  `name` VARCHAR(64) NOT NULL COMMENT '菜品名称',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `description` TEXT NULL COMMENT '菜品描述',
  `image_url` VARCHAR(256) NULL COMMENT '菜品图片URL',
  `sales_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '销量',
  `rating_avg` DECIMAL(2,1) NOT NULL DEFAULT 0.0 COMMENT '平均评分',
  `status` ENUM('ON_SHELF','OFF_SHELF') NOT NULL DEFAULT 'ON_SHELF' COMMENT '上下架状态',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- =====================================================
-- 6. review - 评价表
-- =====================================================
CREATE TABLE `review` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '评价用户ID',
  `food_id` BIGINT UNSIGNED NOT NULL COMMENT '菜品ID',
  `merchant_id` BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `rating` TINYINT UNSIGNED NOT NULL COMMENT '评分(1-5)',
  `content` TEXT NOT NULL COMMENT '评价内容',
  `like_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `dislike_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '踩数',
  `audit_status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
  `audit_admin_id` BIGINT UNSIGNED NULL COMMENT '审核人ID',
  `audit_time` DATETIME NULL COMMENT '审核时间',
  `audit_reason` VARCHAR(256) NULL COMMENT '审核理由(驳回时填写)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- =====================================================
-- 7. review_image - 评价图片表
-- =====================================================
CREATE TABLE `review_image` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` BIGINT UNSIGNED NOT NULL COMMENT '评价ID',
  `image_url` VARCHAR(256) NOT NULL COMMENT '图片URL',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价图片表';

-- =====================================================
-- 8. collection - 收藏表
-- =====================================================
CREATE TABLE `collection` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` ENUM('MERCHANT','FOOD') NOT NULL COMMENT '收藏类型',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID(merchant_id或food_id)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_type_target` (`user_id`,`type`,`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- =====================================================
-- 9. interaction - 互动表
-- =====================================================
CREATE TABLE `interaction` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `review_id` BIGINT UNSIGNED NOT NULL COMMENT '评价ID',
  `type` ENUM('LIKE','DISLIKE') NOT NULL COMMENT '互动类型',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_review` (`user_id`,`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='互动表';

-- =====================================================
-- 10. announcement - 公告表
-- =====================================================
CREATE TABLE `announcement` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` VARCHAR(64) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `publisher_id` BIGINT UNSIGNED NOT NULL COMMENT '发布人ID(ADMIN角色)',
  `publish_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `status` ENUM('PUBLISHED','DRAFT') NOT NULL DEFAULT 'PUBLISHED' COMMENT '状态(已发布/草稿)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- =====================================================
-- 11. activity - 活动表
-- =====================================================
CREATE TABLE `activity` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `title` VARCHAR(64) NOT NULL COMMENT '活动标题',
  `content` TEXT NOT NULL COMMENT '活动内容',
  `start_time` DATETIME NULL COMMENT '开始时间',
  `end_time` DATETIME NULL COMMENT '结束时间',
  `audit_status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
  `auditor_id` BIGINT UNSIGNED NULL COMMENT '审核人ID(ADMIN角色)',
  `audit_time` DATETIME NULL COMMENT '审核时间',
  `audit_reason` VARCHAR(256) NULL COMMENT '审核理由(驳回时填写)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

-- =====================================================
-- 12. activity_image - 活动图片表
-- =====================================================
CREATE TABLE `activity_image` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `activity_id` BIGINT UNSIGNED NOT NULL COMMENT '活动ID',
  `image_url` VARCHAR(256) NOT NULL COMMENT '图片URL',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动图片表';

-- =====================================================
-- 建表完成
-- =====================================================

