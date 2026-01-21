/*
 Navicat Premium Dump SQL

 Source Server         : localhost-huha
 Source Server Type    : MySQL
 Source Server Version : 50730 (5.7.30-log)
 Source Host           : localhost:3306
 Source Schema         : campus_food

 Target Server Type    : MySQL
 Target Server Version : 50730 (5.7.30-log)
 File Encoding         : 65001

 Date: 21/01/2026 09:41:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` bigint(20) UNSIGNED NOT NULL COMMENT '商家ID',
  `title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '活动标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '活动内容',
  `start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
  `audit_status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
  `auditor_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '审核人ID(ADMIN角色)',
  `audit_time` datetime NULL DEFAULT NULL COMMENT '审核时间',
  `audit_reason` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '审核理由(驳回时填写)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (1, 1, '新品试吃活动', '本周推出新品试吃活动，欢迎参与！', '2026-01-05 22:45:36', '2026-01-11 22:45:36', 'APPROVED', 1, '2026-01-04 22:45:36', NULL, NULL, NULL, '2026-01-04 22:45:36', '2026-01-04 22:45:36', 0);
INSERT INTO `activity` VALUES (2, 1, '周末促销活动', '周末全场菜品8折优惠，不容错过！', '2026-01-07 22:45:36', '2026-01-08 22:45:36', 'APPROVED', 1, '2026-01-04 22:45:36', NULL, NULL, NULL, '2026-01-04 22:45:36', '2026-01-04 22:45:36', 0);
INSERT INTO `activity` VALUES (3, 2, '奶茶买一送一', '本周奶茶买一送一，欢迎品尝！', '2026-01-06 22:45:36', '2026-01-09 22:45:36', 'APPROVED', 1, '2026-01-04 22:45:36', NULL, NULL, NULL, '2026-01-04 22:45:36', '2026-01-04 22:45:36', 0);
INSERT INTO `activity` VALUES (4, 2, '新品推广', '新品芝士奶盖上市，首单半价！', '2026-01-05 22:45:36', '2026-01-14 22:45:36', 'APPROVED', 1, '2026-01-04 22:45:36', NULL, NULL, NULL, '2026-01-04 22:45:36', '2026-01-04 22:45:36', 0);

-- ----------------------------
-- Table structure for activity_image
-- ----------------------------
DROP TABLE IF EXISTS `activity_image`;
CREATE TABLE `activity_image`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `activity_id` bigint(20) UNSIGNED NOT NULL COMMENT '活动ID',
  `image_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '图片URL',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动图片表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_image
-- ----------------------------
INSERT INTO `activity_image` VALUES (1, 1, '', 1, NULL, NULL, '2026-01-04 22:45:39', '2026-01-07 23:35:06', 0);
INSERT INTO `activity_image` VALUES (2, 1, '', 2, NULL, NULL, '2026-01-04 22:45:39', '2026-01-07 23:35:07', 0);
INSERT INTO `activity_image` VALUES (3, 3, '', 1, NULL, NULL, '2026-01-04 22:45:39', '2026-01-07 23:35:20', 0);
INSERT INTO `activity_image` VALUES (4, 4, '', 1, NULL, NULL, '2026-01-04 22:45:39', '2026-01-07 23:35:08', 0);

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告内容',
  `publisher_id` bigint(20) UNSIGNED NOT NULL COMMENT '发布人ID(ADMIN角色)',
  `publish_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `status` enum('PUBLISHED','DRAFT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PUBLISHED' COMMENT '状态(已发布/草稿)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES (1, '系统上线通知', '校园美食评价系统试运行，欢迎体验！', 1, '2026-01-07 15:34:08', 'PUBLISHED', NULL, NULL, '2026-01-04 22:45:34', '2026-01-04 22:45:34', 0);
INSERT INTO `announcement` VALUES (2, '食堂调整通知', '一号食堂本周装修，营业时间调整为10:00-20:00', 1, '2026-01-04 22:45:34', 'PUBLISHED', NULL, NULL, '2026-01-04 22:45:34', '2026-01-04 22:45:34', 0);
INSERT INTO `announcement` VALUES (3, '新品推出通知', '二号食堂推出新品水果茶，欢迎品尝！', 1, '2026-01-04 22:45:34', 'PUBLISHED', NULL, NULL, '2026-01-04 22:45:34', '2026-01-04 22:45:34', 0);
INSERT INTO `announcement` VALUES (4, '活动通知', '本周五举办美食节活动，欢迎大家参加！', 1, '2026-01-04 22:45:34', 'PUBLISHED', NULL, NULL, '2026-01-04 22:45:34', '2026-01-04 22:45:34', 0);
INSERT INTO `announcement` VALUES (5, '系统维护通知', '系统将于本周日凌晨2:00-4:00进行维护，请谅解。', 1, '2026-01-04 22:45:34', 'PUBLISHED', NULL, NULL, '2026-01-04 22:45:34', '2026-01-04 22:45:34', 0);

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类名称',
  `description` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类描述',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序(数字越小越靠前)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '早餐', '早点与热饮，包子、豆浆、油条等', 1, NULL, NULL, '2026-01-04 22:45:08', '2026-01-04 22:45:08', 0);
INSERT INTO `category` VALUES (2, '快餐', '盖饭、面食、简餐等', 2, NULL, NULL, '2026-01-04 22:45:08', '2026-01-04 22:45:08', 0);
INSERT INTO `category` VALUES (3, '奶茶', '饮品甜品，奶茶、果汁、甜品等', 3, NULL, NULL, '2026-01-04 22:45:08', '2026-01-04 22:45:08', 0);
INSERT INTO `category` VALUES (4, '小吃', '烧烤、炸串、小吃等', 4, NULL, NULL, '2026-01-04 22:45:08', '2026-01-04 22:45:08', 0);
INSERT INTO `category` VALUES (5, '面食', '面条、米粉、米线等', 5, NULL, NULL, '2026-01-04 22:45:08', '2026-01-04 22:45:08', 0);

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `type` enum('MERCHANT','FOOD') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '收藏类型',
  `target_id` bigint(20) UNSIGNED NOT NULL COMMENT '目标ID(merchant_id或food_id)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_type_target`(`user_id`, `type`, `target_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of collection
-- ----------------------------
INSERT INTO `collection` VALUES (1, 4, 'MERCHANT', 1, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (2, 4, 'FOOD', 2, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (3, 4, 'FOOD', 10, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (4, 5, 'MERCHANT', 2, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (5, 5, 'FOOD', 11, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (6, 6, 'MERCHANT', 1, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (7, 6, 'FOOD', 13, NULL, NULL, '2026-01-04 22:45:27', '2026-01-04 22:45:27', 0);
INSERT INTO `collection` VALUES (8, 7, 'FOOD', 16, NULL, NULL, '2026-01-06 13:40:02', '2026-01-06 13:40:02', 0);
INSERT INTO `collection` VALUES (9, 1, 'FOOD', 10, NULL, NULL, '2026-01-07 16:05:15', '2026-01-07 16:11:27', 1);
INSERT INTO `collection` VALUES (17, 1, 'FOOD', 9, NULL, NULL, '2026-01-07 16:36:01', '2026-01-07 16:36:01', 0);
INSERT INTO `collection` VALUES (18, 1, 'FOOD', 16, NULL, NULL, '2026-01-07 16:36:12', '2026-01-07 16:36:12', 0);
INSERT INTO `collection` VALUES (19, 1, 'MERCHANT', 2, NULL, NULL, '2026-01-07 16:36:19', '2026-01-07 16:36:19', 0);
INSERT INTO `collection` VALUES (20, 1, 'FOOD', 11, NULL, NULL, '2026-01-07 16:40:25', '2026-01-07 16:40:25', 1);
INSERT INTO `collection` VALUES (27, 1, 'FOOD', 15, NULL, NULL, '2026-01-07 16:44:08', '2026-01-07 16:44:09', 1);
INSERT INTO `collection` VALUES (32, 1, 'FOOD', 17, NULL, NULL, '2026-01-07 16:56:49', '2026-01-07 16:57:05', 1);
INSERT INTO `collection` VALUES (42, 1, 'FOOD', 6, NULL, NULL, '2026-01-07 17:07:03', '2026-01-07 17:07:03', 1);
INSERT INTO `collection` VALUES (43, 2, 'FOOD', 10, NULL, NULL, '2026-01-13 14:18:47', '2026-01-13 14:18:47', 0);
INSERT INTO `collection` VALUES (44, 3, 'FOOD', 10, NULL, NULL, '2026-01-13 14:24:54', '2026-01-13 14:24:54', 0);

-- ----------------------------
-- Table structure for food
-- ----------------------------
DROP TABLE IF EXISTS `food`;
CREATE TABLE `food`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` bigint(20) UNSIGNED NOT NULL COMMENT '商家ID',
  `category_id` bigint(20) UNSIGNED NOT NULL COMMENT '分类ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜品名称',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '菜品描述',
  `image_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜品图片URL',
  `sales_count` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '销量',
  `rating_avg` decimal(2, 1) NOT NULL DEFAULT 0.0 COMMENT '平均评分',
  `status` enum('ON_SHELF','OFF_SHELF') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'ON_SHELF' COMMENT '上下架状态',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '菜品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of food
-- ----------------------------
INSERT INTO `food` VALUES (1, 1, 1, '豆浆油条', 6.50, '现磨豆浆配油条，经典早餐', '/uploads/images/doujiangyoutiao.png', 120, 4.5, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-07 21:50:38', 0);
INSERT INTO `food` VALUES (2, 1, 1, '皮蛋瘦肉粥', 8.00, '皮蛋瘦肉粥，营养丰富', '/uploads/images/图虫创意-样图-2352919793634770982_1768285073980.jpeg', 85, 4.3, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (3, 1, 2, '宫保鸡丁盖饭', 18.00, '宫保鸡丁配米饭，分量足', '/uploads/images/图虫创意-样图-1968561813146697754_1768285066064.jpeg', 89, 4.8, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (4, 1, 2, '红烧肉盖饭', 20.00, '红烧肉配米饭，软糯香甜', '/uploads/images/图虫创意-样图-1455654284548243465_1768285107417.jpeg', 65, 4.6, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (5, 1, 2, '番茄鸡蛋面', 15.00, '番茄鸡蛋面，酸甜可口', '/uploads/images/图虫创意-样图-1048745629797974049_1768285119218.jpeg', 52, 4.4, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (6, 1, 4, '炸鸡腿', 8.00, '外酥里嫩，香脆可口', '/uploads/images/图虫创意-样图-2317472079952740362_1768284849701.jpeg', 98, 4.7, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (7, 1, 2, '炸串拼盘', 12.00, '多种炸串，实惠划算', '/uploads/images/图虫创意-样图-2059262185165291521_1768285086674.jpeg', 76, 4.5, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (8, 1, 5, '牛肉面', 16.00, '大块牛肉配面条，劲道爽滑', '/uploads/images/图虫创意-样图-2050150205877780483_1768285096137.jpeg', 68, 4.6, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:13', '2026-01-04 22:45:13', 0);
INSERT INTO `food` VALUES (9, 2, 1, '现磨豆浆', 4.00, '现磨豆浆，营养健康', '/uploads/images/xianmodoujiang.png', 150, 4.2, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-07 21:49:08', 0);
INSERT INTO `food` VALUES (10, 2, 3, '招牌奶茶', 12.00, '手工调制奶茶，口感丝滑', '/uploads/images/奶茶.png', 200, 4.7, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-07 21:44:18', 0);
INSERT INTO `food` VALUES (11, 2, 3, '珍珠奶茶', 15.00, '香浓奶茶配珍珠，Q弹可口', '/uploads/images/zhenzhunaicha.png', 150, 4.4, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-07 21:47:45', 0);
INSERT INTO `food` VALUES (12, 2, 3, '水果茶', 14.00, '新鲜水果配茶，清爽解腻', '/uploads/images/shuiguocha_1767805846483.png', 120, 4.5, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-04 22:45:16', 0);
INSERT INTO `food` VALUES (13, 2, 3, '芝士奶盖', 16.00, '绵密奶盖，香浓可口', '/uploads/images/图虫创意-样图-2297472779391336452_1768285267686.jpeg', 85, 4.6, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-04 22:45:16', 0);
INSERT INTO `food` VALUES (14, 2, 3, '红豆奶茶', 14.00, '红豆配奶茶，香甜软糯', '/uploads/images/红豆奶茶_1767805806194.png', 95, 4.3, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-04 22:45:16', 0);
INSERT INTO `food` VALUES (15, 2, 3, '椰果奶茶', 13.00, '椰果配奶茶，Q弹爽口', '/uploads/images/图虫创意-样图-2439724054771400755_1768285253415.jpeg', 88, 4.4, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-04 22:45:16', 0);
INSERT INTO `food` VALUES (16, 2, 4, '烤肠', 3.00, '香肠烤制，外酥里嫩', '/uploads/images/kaochang.png', 220, 4.5, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-07 21:16:49', 0);
INSERT INTO `food` VALUES (17, 2, 4, '烤鸡翅', 6.00, '鸡翅烤制，鲜嫩多汁', '/uploads/images/kaojichi.png', 180, 4.6, 'ON_SHELF', NULL, NULL, '2026-01-04 22:45:16', '2026-01-07 21:46:03', 0);

-- ----------------------------
-- Table structure for interaction
-- ----------------------------
DROP TABLE IF EXISTS `interaction`;
CREATE TABLE `interaction`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `review_id` bigint(20) UNSIGNED NOT NULL COMMENT '评价ID',
  `type` enum('LIKE','DISLIKE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '互动类型',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_review`(`user_id`, `review_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '互动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of interaction
-- ----------------------------
INSERT INTO `interaction` VALUES (3, 1, 4, 'LIKE', NULL, NULL, '2026-01-07 17:54:41', '2026-01-07 17:54:41', 0);
INSERT INTO `interaction` VALUES (4, 1, 12, 'LIKE', NULL, NULL, '2026-01-11 23:00:20', '2026-01-11 23:00:20', 0);

-- ----------------------------
-- Table structure for merchant
-- ----------------------------
DROP TABLE IF EXISTS `merchant`;
CREATE TABLE `merchant`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '关联用户ID(MERCHANT角色)',
  `shop_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '店铺名称',
  `address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '店铺地址',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '店铺描述',
  `cover_image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `coordinate_x` decimal(10, 6) NULL DEFAULT NULL COMMENT '坐标X',
  `coordinate_y` decimal(10, 6) NULL DEFAULT NULL COMMENT '坐标Y',
  `opening_hours` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '营业时间',
  `audit_status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
  `status` enum('ACTIVE','DISABLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'ACTIVE' COMMENT '店铺状态',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商家表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of merchant
-- ----------------------------
INSERT INTO `merchant` VALUES (1, 2, '一号食堂·小炒', '一教旁', '主营川湘小炒，口味地道，分量足', '/uploads/images/图虫创意-样图-2027149023865208835_1768150083956.jpeg', 116.397000, 39.904000, '07:00-21:00', 'APPROVED', 'ACTIVE', NULL, NULL, '2026-01-04 22:45:10', '2026-01-04 22:45:10', 0);
INSERT INTO `merchant` VALUES (2, 3, '二号食堂·奶茶', '二教旁', '手工制作奶茶，口感丝滑', '/uploads/images/图虫创意-样图-2462194842693927044_1768144285808.jpeg', 116.398000, 39.905000, '09:00-22:00', 'APPROVED', 'ACTIVE', NULL, NULL, '2026-01-04 22:45:10', '2026-01-04 22:45:10', 0);

-- ----------------------------
-- Table structure for review
-- ----------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '评价用户ID',
  `food_id` bigint(20) UNSIGNED NOT NULL COMMENT '菜品ID',
  `merchant_id` bigint(20) UNSIGNED NOT NULL COMMENT '商家ID',
  `rating` tinyint(3) UNSIGNED NOT NULL COMMENT '评分(1-5)',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评价内容',
  `like_count` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `dislike_count` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '踩数',
  `audit_status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
  `audit_admin_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '审核人ID',
  `audit_time` datetime NULL DEFAULT NULL COMMENT '审核时间',
  `audit_reason` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '审核理由(驳回时填写)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评价表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review
-- ----------------------------
INSERT INTO `review` VALUES (1, 4, 2, 1, 5, '味道不错，分量足，下次还会来！', 12, 1, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (2, 5, 2, 1, 4, '很好吃，就是稍微有点咸', 5, 1, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (3, 6, 2, 1, 5, '宫保鸡丁炒得很好吃，鸡肉嫩滑', 8, 1, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (4, 4, 3, 1, 4, '红烧肉很香，就是有点腻', 7, 0, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (5, 5, 3, 1, 5, '红烧肉软糯香甜，很好吃', 15, 0, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (6, 4, 10, 2, 5, '奶茶超好喝，推荐大家尝试！', 25, 0, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (7, 5, 11, 2, 4, '珍珠很Q弹，味道也不错', 18, 0, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (8, 6, 11, 2, 5, '珍珠奶茶味道很棒，经常买', 20, 1, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (9, 4, 12, 2, 4, '水果茶很清爽，夏天喝很解渴', 11, 0, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (10, 5, 13, 2, 5, '芝士奶盖很香浓，推荐！', 14, 0, 'APPROVED', 1, '2026-01-04 22:45:20', NULL, NULL, NULL, '2026-01-04 22:45:20', '2026-01-04 22:45:20', 0);
INSERT INTO `review` VALUES (11, 7, 1, 1, 5, '可以可以啊啊啊啊啊啊啊啊', 0, 0, 'APPROVED', 1, '2026-01-07 18:08:58', '', NULL, NULL, '2026-01-07 17:24:04', '2026-01-07 17:24:04', 0);
INSERT INTO `review` VALUES (12, 7, 16, 2, 5, '可以可以1111111111', 1, 0, 'APPROVED', 1, '2026-01-07 23:19:26', '', NULL, NULL, '2026-01-07 23:18:59', '2026-01-07 23:18:59', 0);
INSERT INTO `review` VALUES (13, 7, 10, 2, 5, '非常可以，我是王智慧，我爱喝', 0, 0, 'PENDING', NULL, NULL, NULL, NULL, NULL, '2026-01-11 23:15:44', '2026-01-11 23:15:44', 0);
INSERT INTO `review` VALUES (14, 7, 17, 2, 5, '我是渣渣辉，我推荐这个鸡翅', 0, 0, 'APPROVED', 1, '2026-01-11 23:32:02', '', NULL, NULL, '2026-01-11 23:31:05', '2026-01-11 23:31:05', 0);

-- ----------------------------
-- Table structure for review_image
-- ----------------------------
DROP TABLE IF EXISTS `review_image`;
CREATE TABLE `review_image`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` bigint(20) UNSIGNED NOT NULL COMMENT '评价ID',
  `image_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '图片URL',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评价图片表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review_image
-- ----------------------------
INSERT INTO `review_image` VALUES (1, 1, '', 1, NULL, NULL, '2026-01-04 22:45:24', '2026-01-07 23:36:29', 0);
INSERT INTO `review_image` VALUES (2, 1, '', 2, NULL, NULL, '2026-01-04 22:45:24', '2026-01-07 23:36:31', 0);
INSERT INTO `review_image` VALUES (3, 6, '', 1, NULL, NULL, '2026-01-04 22:45:24', '2026-01-07 23:36:32', 0);
INSERT INTO `review_image` VALUES (4, 10, '', 1, NULL, NULL, '2026-01-04 22:45:24', '2026-01-08 00:15:42', 0);
INSERT INTO `review_image` VALUES (5, 14, '/uploads/images/d32250568702849a1e10340c6f5aab0d_720_1768144542699_1768145464059.jpg', 0, NULL, NULL, '2026-01-11 23:31:05', '2026-01-11 23:31:05', 0);

-- ----------------------------
-- Table structure for review_reply
-- ----------------------------
DROP TABLE IF EXISTS `review_reply`;
CREATE TABLE `review_reply`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` bigint(20) UNSIGNED NOT NULL COMMENT '评价ID',
  `merchant_id` bigint(20) UNSIGNED NOT NULL COMMENT '商家ID（回复者）',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '回复内容',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_review_id`(`review_id`) USING BTREE,
  INDEX `idx_merchant_id`(`merchant_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评价回复表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review_reply
-- ----------------------------

-- ----------------------------
-- Table structure for review_tag
-- ----------------------------
DROP TABLE IF EXISTS `review_tag`;
CREATE TABLE `review_tag`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标签名称',
  `type` enum('POSITIVE','NEGATIVE','NEUTRAL') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'POSITIVE' COMMENT '标签类型(正面/负面/中性)',
  `icon` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标签图标',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序(数字越小越靠前)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评价标签表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review_tag
-- ----------------------------
INSERT INTO `review_tag` VALUES (1, '味道好', 'POSITIVE', NULL, 1, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (2, '分量足', 'POSITIVE', NULL, 2, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (3, '性价比高', 'POSITIVE', NULL, 3, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (4, '环境好', 'POSITIVE', NULL, 4, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (5, '服务好', 'POSITIVE', NULL, 5, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (6, '上菜快', 'POSITIVE', NULL, 6, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (7, '新鲜', 'POSITIVE', NULL, 7, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (8, '卫生', 'POSITIVE', NULL, 8, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (9, '味道一般', 'NEUTRAL', NULL, 9, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (10, '分量少', 'NEGATIVE', NULL, 10, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (11, '价格贵', 'NEGATIVE', NULL, 11, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (12, '环境差', 'NEGATIVE', NULL, 12, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (13, '服务差', 'NEGATIVE', NULL, 13, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (14, '上菜慢', 'NEGATIVE', NULL, 14, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);
INSERT INTO `review_tag` VALUES (15, '不新鲜', 'NEGATIVE', NULL, 15, NULL, NULL, '2026-01-11 20:56:14', '2026-01-11 20:56:14', 0);

-- ----------------------------
-- Table structure for review_tag_relation
-- ----------------------------
DROP TABLE IF EXISTS `review_tag_relation`;
CREATE TABLE `review_tag_relation`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` bigint(20) UNSIGNED NOT NULL COMMENT '评价ID',
  `tag_id` bigint(20) UNSIGNED NOT NULL COMMENT '标签ID',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_review_tag`(`review_id`, `tag_id`) USING BTREE,
  INDEX `idx_review_id`(`review_id`) USING BTREE,
  INDEX `idx_tag_id`(`tag_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评价标签关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of review_tag_relation
-- ----------------------------
INSERT INTO `review_tag_relation` VALUES (1, 13, 1, NULL, NULL, '2026-01-11 23:15:44', '2026-01-11 23:15:44', 0);
INSERT INTO `review_tag_relation` VALUES (2, 13, 3, NULL, NULL, '2026-01-11 23:15:44', '2026-01-11 23:15:44', 0);
INSERT INTO `review_tag_relation` VALUES (3, 14, 1, NULL, NULL, '2026-01-11 23:31:05', '2026-01-11 23:31:05', 0);
INSERT INTO `review_tag_relation` VALUES (4, 14, 2, NULL, NULL, '2026-01-11 23:31:05', '2026-01-11 23:31:05', 0);
INSERT INTO `review_tag_relation` VALUES (5, 14, 3, NULL, NULL, '2026-01-11 23:31:05', '2026-01-11 23:31:05', 0);
INSERT INTO `review_tag_relation` VALUES (6, 14, 4, NULL, NULL, '2026-01-11 23:31:05', '2026-01-11 23:31:05', 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录用户名',
  `password_hash` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码哈希(BCrypt)',
  `role` enum('STUDENT','MERCHANT','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色',
  `status` enum('ACTIVE','DISABLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户基础表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '$2a$10$zB1czTbSeRjN9F7YTDLXiue854Y/74XuTBV5/unz84fbkObbnIGX6', 'ADMIN', 'ACTIVE', NULL, 1, '2026-01-04 22:45:02', '2026-01-05 10:32:14', 0);
INSERT INTO `user` VALUES (2, 'sj', '$2a$10$Hlt2Bsqiq71yfajCVqjjBOcyT01v19xzCi/beEFBRsE1XAOjIYtj2', 'MERCHANT', 'ACTIVE', NULL, 2, '2026-01-04 22:45:02', '2026-01-07 20:31:24', 0);
INSERT INTO `user` VALUES (3, 'sjj', '$2a$10$Hlt2Bsqiq71yfajCVqjjBOcyT01v19xzCi/beEFBRsE1XAOjIYtj2', 'MERCHANT', 'ACTIVE', NULL, NULL, '2026-01-04 22:45:02', '2026-01-08 00:16:03', 0);
INSERT INTO `user` VALUES (4, 'stu001', '$2a$10$Hlt2Bsqiq71yfajCVqjjBOcyT01v19xzCi/beEFBRsE1XAOjIYtj2', 'STUDENT', 'ACTIVE', NULL, NULL, '2026-01-04 22:45:02', '2026-01-05 10:32:23', 0);
INSERT INTO `user` VALUES (5, 'stu002', '$2a$10$Hlt2Bsqiq71yfajCVqjjBOcyT01v19xzCi/beEFBRsE1XAOjIYtj2', 'STUDENT', 'ACTIVE', NULL, 5, '2026-01-04 22:45:02', '2026-01-05 10:32:24', 0);
INSERT INTO `user` VALUES (6, 'stu003', '$2a$10$Hlt2Bsqiq71yfajCVqjjBOcyT01v19xzCi/beEFBRsE1XAOjIYtj2', 'STUDENT', 'ACTIVE', NULL, NULL, '2026-01-04 22:45:02', '2026-01-05 10:48:12', 0);
INSERT INTO `user` VALUES (7, 'xzj', '$2a$10$Hlt2Bsqiq71yfajCVqjjBOcyT01v19xzCi/beEFBRsE1XAOjIYtj2', 'STUDENT', 'ACTIVE', NULL, 7, '2026-01-05 10:31:33', '2026-01-05 10:31:33', 0);

-- ----------------------------
-- Table structure for user_profile
-- ----------------------------
DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE `user_profile`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '关联用户ID',
  `nickname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像URL',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `student_no` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '学号(学生)',
  `creator_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建者ID',
  `updater_id` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户资料表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_profile
-- ----------------------------
INSERT INTO `user_profile` VALUES (1, 1, '系统管理员', '/uploads/images/admin.png', '13635415228', '229970335', NULL, NULL, '2026-01-04 22:45:05', '2026-01-07 22:09:45', 0);
INSERT INTO `user_profile` VALUES (2, 2, '小炒店老板', '/uploads/images/doujiangyoutiao_1767806248701.png', '13800000001', NULL, NULL, NULL, '2026-01-04 22:45:05', '2026-01-08 01:17:30', 0);
INSERT INTO `user_profile` VALUES (3, 3, '奶茶店老板', NULL, '13800000002', NULL, NULL, NULL, '2026-01-04 22:45:05', '2026-01-04 22:45:05', 0);
INSERT INTO `user_profile` VALUES (4, 4, '张三', NULL, '13900000001', '20230001', NULL, NULL, '2026-01-04 22:45:05', '2026-01-04 22:45:05', 0);
INSERT INTO `user_profile` VALUES (5, 5, '李四', NULL, '13900000002', '20230002', NULL, NULL, '2026-01-04 22:45:05', '2026-01-04 22:45:05', 0);
INSERT INTO `user_profile` VALUES (6, 6, '王五', NULL, '13900000003', '20230003', NULL, NULL, '2026-01-04 22:45:05', '2026-01-04 22:45:05', 0);
INSERT INTO `user_profile` VALUES (7, 7, 'xzj', '/uploads/images/b_f7e7d0731db32dc9ac83237616866f1c_1768286982017.jpg', '13635415223', '229970335', NULL, NULL, '2026-01-05 10:31:33', '2026-01-13 15:01:03', 0);

SET FOREIGN_KEY_CHECKS = 1;
