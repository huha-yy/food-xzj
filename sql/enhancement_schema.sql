-- =====================================================
-- 美食评价系统功能增强 - 数据库表
-- 包含：商家回复、评价标签功能
-- =====================================================

USE `campus_food`;

SET NAMES utf8mb4;

-- =====================================================
-- 13. review_reply - 评价回复表（商家回复）
-- =====================================================
CREATE TABLE `review_reply` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` BIGINT UNSIGNED NOT NULL COMMENT '评价ID',
  `merchant_id` BIGINT UNSIGNED NOT NULL COMMENT '商家ID（回复者）',
  `content` TEXT NOT NULL COMMENT '回复内容',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  KEY `idx_review_id` (`review_id`),
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价回复表';

-- =====================================================
-- 14. review_tag - 评价标签表
-- =====================================================
CREATE TABLE `review_tag` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(32) NOT NULL COMMENT '标签名称',
  `type` ENUM('POSITIVE','NEGATIVE','NEUTRAL') NOT NULL DEFAULT 'POSITIVE' COMMENT '标签类型(正面/负面/中性)',
  `icon` VARCHAR(64) NULL COMMENT '标签图标',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序(数字越小越靠前)',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价标签表';

-- =====================================================
-- 15. review_tag_relation - 评价标签关联表
-- =====================================================
CREATE TABLE `review_tag_relation` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` BIGINT UNSIGNED NOT NULL COMMENT '评价ID',
  `tag_id` BIGINT UNSIGNED NOT NULL COMMENT '标签ID',
  `creator_id` BIGINT UNSIGNED NULL COMMENT '创建者ID',
  `updater_id` BIGINT UNSIGNED NULL COMMENT '更新者ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除(0=未删,1=已删)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_review_tag` (`review_id`,`tag_id`),
  KEY `idx_review_id` (`review_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价标签关联表';

-- =====================================================
-- 初始化评价标签数据
-- =====================================================
INSERT INTO `review_tag` (`name`, `type`, `sort`) VALUES
('味道好', 'POSITIVE', 1),
('分量足', 'POSITIVE', 2),
('性价比高', 'POSITIVE', 3),
('环境好', 'POSITIVE', 4),
('服务好', 'POSITIVE', 5),
('上菜快', 'POSITIVE', 6),
('新鲜', 'POSITIVE', 7),
('卫生', 'POSITIVE', 8),
('味道一般', 'NEUTRAL', 9),
('分量少', 'NEGATIVE', 10),
('价格贵', 'NEGATIVE', 11),
('环境差', 'NEGATIVE', 12),
('服务差', 'NEGATIVE', 13),
('上菜慢', 'NEGATIVE', 14),
('不新鲜', 'NEGATIVE', 15);

-- =====================================================
-- 建表完成
-- =====================================================
