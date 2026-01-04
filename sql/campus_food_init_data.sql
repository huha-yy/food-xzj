-- =====================================================
-- 大学生校内美食评价系统 - 初始化测试数据SQL
-- 数据库: campus_food
-- 说明: 执行前请先执行 campus_food_schema.sql 建表
-- =====================================================

USE `campus_food`;

-- =====================================================
-- 清空表数据（开发环境使用）
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `activity_image`;
TRUNCATE TABLE `activity`;
TRUNCATE TABLE `interaction`;
TRUNCATE TABLE `collection`;
TRUNCATE TABLE `review_image`;
TRUNCATE TABLE `review`;
TRUNCATE TABLE `food`;
TRUNCATE TABLE `merchant`;
TRUNCATE TABLE `category`;
TRUNCATE TABLE `announcement`;
TRUNCATE TABLE `user_profile`;
TRUNCATE TABLE `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. 初始化用户表 (user)
-- =====================================================
-- 注意: 密码字段需要使用BCrypt加密，以下为示例密码"123456"的哈希值
-- 实际使用时请使用 BCryptPasswordEncoder 生成新的哈希值
INSERT INTO `user`(`id`,`username`,`password_hash`,`role`,`status`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (1,'admin','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH','ADMIN','ACTIVE',NULL,NULL,NOW(),NOW()),
  (2,'merchant001','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH','MERCHANT','ACTIVE',NULL,NULL,NOW(),NOW()),
  (3,'merchant002','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH','MERCHANT','ACTIVE',NULL,NULL,NOW(),NOW()),
  (4,'stu001','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH','STUDENT','ACTIVE',NULL,NULL,NOW(),NOW()),
  (5,'stu002','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH','STUDENT','ACTIVE',NULL,NULL,NOW(),NOW()),
  (6,'stu003','$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH','STUDENT','ACTIVE',NULL,NULL,NOW(),NOW());

-- =====================================================
-- 2. 初始化用户资料表 (user_profile)
-- =====================================================
INSERT INTO `user_profile`(`user_id`,`nickname`,`avatar`,`phone`,`student_no`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (1,'系统管理员',NULL,NULL,NULL,NULL,NULL,NOW(),NOW()),
  (2,'小炒店老板',NULL,'13800000001',NULL,NULL,NULL,NOW(),NOW()),
  (3,'奶茶店老板',NULL,'13800000002',NULL,NULL,NULL,NOW(),NOW()),
  (4,'张三',NULL,'13900000001','20230001',NULL,NULL,NOW(),NOW()),
  (5,'李四',NULL,'13900000002','20230002',NULL,NULL,NOW(),NOW()),
  (6,'王五',NULL,'13900000003','20230003',NULL,NULL,NOW(),NOW());

-- =====================================================
-- 3. 初始化分类表 (category)
-- =====================================================
INSERT INTO `category`(`name`,`description`,`sort`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  ('早餐','早点与热饮，包子、豆浆、油条等',1,NULL,NULL,NOW(),NOW()),
  ('快餐','盖饭、面食、简餐等',2,NULL,NULL,NOW(),NOW()),
  ('奶茶','饮品甜品，奶茶、果汁、甜品等',3,NULL,NULL,NOW(),NOW()),
  ('小吃','烧烤、炸串、小吃等',4,NULL,NULL,NOW(),NOW()),
  ('面食','面条、米粉、米线等',5,NULL,NULL,NOW(),NOW());

-- =====================================================
-- 4. 初始化商家表 (merchant)
-- =====================================================
INSERT INTO `merchant`(`user_id`,`shop_name`,`address`,`description`,`cover_image`,`coordinate_x`,`coordinate_y`,`opening_hours`,`audit_status`,`status`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (2,'一号食堂·小炒','一教旁','主营川湘小炒，口味地道，分量足',NULL,116.397000,39.904000,'07:00-21:00','APPROVED','ACTIVE',NULL,NULL,NOW(),NOW()),
  (3,'二号食堂·奶茶','二教旁','手工制作奶茶，口感丝滑',NULL,116.398000,39.905000,'09:00-22:00','APPROVED','ACTIVE',NULL,NULL,NOW(),NOW());

-- =====================================================
-- 5. 初始化菜品表 (food)
-- =====================================================
-- 一号食堂·小炒的菜品
INSERT INTO `food`(`merchant_id`,`category_id`,`name`,`price`,`description`,`image_url`,`sales_count`,`rating_avg`,`status`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (1,1,'豆浆油条',6.50,'现磨豆浆配油条，经典早餐',NULL,120,4.5,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,1,'皮蛋瘦肉粥',8.00,'皮蛋瘦肉粥，营养丰富',NULL,85,4.3,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,2,'宫保鸡丁盖饭',18.00,'宫保鸡丁配米饭，分量足',NULL,89,4.8,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,2,'红烧肉盖饭',20.00,'红烧肉配米饭，软糯香甜',NULL,65,4.6,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,2,'番茄鸡蛋面',15.00,'番茄鸡蛋面，酸甜可口',NULL,52,4.4,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,4,'炸鸡腿',8.00,'外酥里嫩，香脆可口',NULL,98,4.7,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,4,'炸串拼盘',12.00,'多种炸串，实惠划算',NULL,76,4.5,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (1,5,'牛肉面',16.00,'大块牛肉配面条，劲道爽滑',NULL,68,4.6,'ON_SHELF',NULL,NULL,NOW(),NOW());

-- 二号食堂·奶茶的菜品
INSERT INTO `food`(`merchant_id`,`category_id`,`name`,`price`,`description`,`image_url`,`sales_count`,`rating_avg`,`status`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (2,1,'现磨豆浆',4.00,'现磨豆浆，营养健康',NULL,150,4.2,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,3,'招牌奶茶',12.00,'手工调制奶茶，口感丝滑',NULL,200,4.7,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,3,'珍珠奶茶',15.00,'香浓奶茶配珍珠，Q弹可口',NULL,150,4.4,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,3,'水果茶',14.00,'新鲜水果配茶，清爽解腻',NULL,120,4.5,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,3,'芝士奶盖',16.00,'绵密奶盖，香浓可口',NULL,85,4.6,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,3,'红豆奶茶',14.00,'红豆配奶茶，香甜软糯',NULL,95,4.3,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,3,'椰果奶茶',13.00,'椰果配奶茶，Q弹爽口',NULL,88,4.4,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,4,'烤肠',3.00,'香肠烤制，外酥里嫩',NULL,220,4.5,'ON_SHELF',NULL,NULL,NOW(),NOW()),
  (2,4,'烤鸡翅',6.00,'鸡翅烤制，鲜嫩多汁',NULL,180,4.6,'ON_SHELF',NULL,NULL,NOW(),NOW());

-- =====================================================
-- 6. 初始化评价表 (review)
-- =====================================================
INSERT INTO `review`(`user_id`,`food_id`,`merchant_id`,`rating`,`content`,`like_count`,`dislike_count`,`audit_status`,`audit_admin_id`,`audit_time`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (4,2,1,5,'味道不错，分量足，下次还会来！',12,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (5,2,1,4,'很好吃，就是稍微有点咸',5,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (6,2,1,5,'宫保鸡丁炒得很好吃，鸡肉嫩滑',8,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (4,3,1,4,'红烧肉很香，就是有点腻',6,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (5,3,1,5,'红烧肉软糯香甜，很好吃',15,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (4,10,2,5,'奶茶超好喝，推荐大家尝试！',25,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (5,11,2,4,'珍珠很Q弹，味道也不错',18,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (6,11,2,5,'珍珠奶茶味道很棒，经常买',20,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (4,12,2,4,'水果茶很清爽，夏天喝很解渴',10,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (5,13,2,5,'芝士奶盖很香浓，推荐！',14,0,'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW());

-- =====================================================
-- 7. 初始化评价图片表 (review_image)
-- =====================================================
INSERT INTO `review_image`(`review_id`,`image_url`,`sort`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (1,'/uploads/review/20240101/review_1_image_1.jpg',1,NULL,NULL,NOW(),NOW()),
  (1,'/uploads/review/20240101/review_1_image_2.jpg',2,NULL,NULL,NOW(),NOW()),
  (6,'/uploads/review/20240101/review_6_image_1.jpg',1,NULL,NULL,NOW(),NOW()),
  (10,'/uploads/review/20240101/review_10_image_1.jpg',1,NULL,NULL,NOW(),NOW());

-- =====================================================
-- 8. 初始化收藏表 (collection)
-- =====================================================
INSERT INTO `collection`(`user_id`,`type`,`target_id`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (4,'MERCHANT',1,NULL,NULL,NOW(),NOW()),
  (4,'FOOD',2,NULL,NULL,NOW(),NOW()),
  (4,'FOOD',10,NULL,NULL,NOW(),NOW()),
  (5,'MERCHANT',2,NULL,NULL,NOW(),NOW()),
  (5,'FOOD',11,NULL,NULL,NOW(),NOW()),
  (6,'MERCHANT',1,NULL,NULL,NOW(),NOW()),
  (6,'FOOD',13,NULL,NULL,NOW(),NOW());

-- =====================================================
-- 9. 初始化互动表 (interaction)
-- =====================================================
INSERT INTO `interaction`(`user_id`,`review_id`,`type`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (5,1,'LIKE',NULL,NULL,NOW(),NOW()),
  (6,1,'LIKE',NULL,NULL,NOW(),NOW()),
  (4,2,'LIKE',NULL,NULL,NOW(),NOW()),
  (6,2,'LIKE',NULL,NULL,NOW(),NOW()),
  (5,3,'LIKE',NULL,NULL,NOW(),NOW()),
  (4,3,'LIKE',NULL,NULL,NOW(),NOW()),
  (5,6,'LIKE',NULL,NULL,NOW(),NOW()),
  (6,6,'LIKE',NULL,NULL,NOW(),NOW()),
  (4,7,'LIKE',NULL,NULL,NOW(),NOW()),
  (5,10,'LIKE',NULL,NULL,NOW(),NOW());

-- =====================================================
-- 10. 初始化公告表 (announcement)
-- =====================================================
INSERT INTO `announcement`(`title`,`content`,`publisher_id`,`publish_time`,`status`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  ('系统上线通知','校园美食评价系统试运行，欢迎体验！',1,NOW(),'PUBLISHED',NULL,NULL,NOW(),NOW()),
  ('食堂调整通知','一号食堂本周装修，营业时间调整为10:00-20:00',1,NOW(),'PUBLISHED',NULL,NULL,NOW(),NOW()),
  ('新品推出通知','二号食堂推出新品水果茶，欢迎品尝！',1,NOW(),'PUBLISHED',NULL,NULL,NOW(),NOW()),
  ('活动通知','本周五举办美食节活动，欢迎大家参加！',1,NOW(),'PUBLISHED',NULL,NULL,NOW(),NOW()),
  ('系统维护通知','系统将于本周日凌晨2:00-4:00进行维护，请谅解。',1,NOW(),'PUBLISHED',NULL,NULL,NOW(),NOW());

-- =====================================================
-- 11. 初始化活动表 (activity)
-- =====================================================
INSERT INTO `activity`(`merchant_id`,`title`,`content`,`start_time`,`end_time`,`audit_status`,`auditor_id`,`audit_time`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (1,'新品试吃活动','本周推出新品试吃活动，欢迎参与！',DATE_ADD(NOW(),INTERVAL 1 DAY),DATE_ADD(NOW(),INTERVAL 7 DAY),'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (1,'周末促销活动','周末全场菜品8折优惠，不容错过！',DATE_ADD(NOW(),INTERVAL 3 DAY),DATE_ADD(NOW(),INTERVAL 4 DAY),'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (2,'奶茶买一送一','本周奶茶买一送一，欢迎品尝！',DATE_ADD(NOW(),INTERVAL 2 DAY),DATE_ADD(NOW(),INTERVAL 5 DAY),'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW()),
  (2,'新品推广','新品芝士奶盖上市，首单半价！',DATE_ADD(NOW(),INTERVAL 1 DAY),DATE_ADD(NOW(),INTERVAL 10 DAY),'APPROVED',1,NOW(),NULL,NULL,NOW(),NOW());

-- =====================================================
-- 12. 初始化活动图片表 (activity_image)
-- =====================================================
INSERT INTO `activity_image`(`activity_id`,`image_url`,`sort`,`creator_id`,`updater_id`,`create_time`,`update_time`)
VALUES
  (1,'/uploads/activity/20240101/activity_1_image_1.jpg',1,NULL,NULL,NOW(),NOW()),
  (1,'/uploads/activity/20240101/activity_1_image_2.jpg',2,NULL,NULL,NOW(),NOW()),
  (3,'/uploads/activity/20240101/activity_3_image_1.jpg',1,NULL,NULL,NOW(),NOW()),
  (4,'/uploads/activity/20240101/activity_4_image_1.jpg',1,NULL,NULL,NOW(),NOW());

-- =====================================================
-- 初始化数据完成
-- =====================================================

-- =====================================================
-- 测试账号说明
-- =====================================================
-- 管理员账号: admin / 密码: 123456
-- 商家账号: merchant001 / 密码: 123456
-- 商家账号: merchant002 / 密码: 123456
-- 学生账号: stu001 / 密码: 123456
-- 学生账号: stu002 / 密码: 123456
-- 学生账号: stu003 / 密码: 123456
--
-- 注意: 以上密码是明文，实际使用时需要替换为BCrypt加密后的哈希值
-- 可以使用 Spring Security 的 BCryptPasswordEncoder 生成新的哈希值

