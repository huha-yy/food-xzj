package com.campus.food.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.food.entity.Food;
import com.campus.food.entity.Merchant;
import com.campus.food.entity.Review;
import com.campus.food.entity.User;
import com.campus.food.mapper.FoodMapper;
import com.campus.food.mapper.MerchantMapper;
import com.campus.food.mapper.ReviewMapper;
import com.campus.food.mapper.UserMapper;
import com.campus.food.service.AdminService;
import com.campus.food.vo.StatisticsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 管理员服务实现
 */
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final FoodMapper foodMapper;
    private final ReviewMapper reviewMapper;

    @Override
    public StatisticsVO getStatistics() {
        // 查询用户总数
        Long userCount = userMapper.selectCount(
                new LambdaQueryWrapper<User>().eq(User::getIsDeleted, 0)
        );

        // 查询商家总数
        Long merchantCount = merchantMapper.selectCount(
                new LambdaQueryWrapper<Merchant>().eq(Merchant::getIsDeleted, 0)
        );

        // 查询菜品总数
        Long foodCount = foodMapper.selectCount(
                new LambdaQueryWrapper<Food>().eq(Food::getIsDeleted, 0)
        );

        // 查询评价总数
        Long reviewCount = reviewMapper.selectCount(
                new LambdaQueryWrapper<Review>().eq(Review::getIsDeleted, 0)
        );

        return StatisticsVO.builder()
                .userCount(userCount)
                .merchantCount(merchantCount)
                .foodCount(foodCount)
                .reviewCount(reviewCount)
                .build();
    }
}

