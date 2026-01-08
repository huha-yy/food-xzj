import { useEffect, useState } from 'react'
import { Card, Input, Select, Tag, Rate, Button, Empty, Spin, Avatar, Image, Statistic, Row, Col, Skeleton } from 'antd'
import { SearchOutlined, ShopOutlined, StarOutlined, LikeOutlined, DislikeOutlined, CommentOutlined, FireOutlined, CoffeeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getReviewList, likeReview, dislikeReview, cancelInteraction, getReviewStatistics } from '@/api/review'
import './ReviewList.css'

const { Option } = Select

function ReviewList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [reviewList, setReviewList] = useState([])
  const [total, setTotal] = useState(0)
  const [statistics, setStatistics] = useState(null)
  const [params, setParams] = useState({
    current: 1,
    pageSize: 10,
    keyword: '',
    auditStatus: undefined,
    foodId: undefined
  })

  useEffect(() => {
    fetchReviewList()
  }, [params])

  const fetchReviewList = async () => {
    try {
      setLoading(true)
      const [listData, statsData] = await Promise.all([
        getReviewList(params),
        getReviewStatistics()
      ])
      setReviewList(listData?.records || [])
      setTotal(listData?.total || 0)
      setStatistics(statsData)
    } catch (error) {
      console.error('获取评价列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setParams({ ...params, current: 1 })
  }

  const handleLike = async (reviewId) => {
    try {
      await likeReview(reviewId)
      fetchReviewList()
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const handleDislike = async (reviewId) => {
    try {
      await dislikeReview(reviewId)
      fetchReviewList()
    } catch (error) {
      console.error('踩失败:', error)
    }
  }

  const handleCancelInteraction = async (reviewId) => {
    try {
      await cancelInteraction(reviewId)
      fetchReviewList()
    } catch (error) {
      console.error('取消操作失败:', error)
    }
  }

  const goToFoodDetail = (foodId) => {
    navigate(`/foods/${foodId}`)
  }

  if (loading) {
    return (
      <div className="review-list">
        <div className="skeleton-container">
          <Card className="stats-card-skeleton">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="review-item-skeleton">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="review-list">
      <div className="page-header">
        <h1>评价列表</h1>
        <p>查看所有用户评价</p>
      </div>

      {/* 统计卡片 */}
      {statistics && (
        <Card className="stats-card" bordered={false}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Statistic
                title="总评价数"
                value={statistics.totalCount}
                prefix={<CommentOutlined />}
                valueStyle={{ color: '#ff6b35' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="平均评分"
                value={statistics.averageRating || 0}
                precision={1}
                suffix="分"
                prefix={<StarOutlined />}
                valueStyle={{ color: '#e84118' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="今日新增"
                value={statistics.todayCount}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#ff6b35' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <div className="filter-row">
          <Input
            placeholder="搜索评价内容"
            prefix={<SearchOutlined />}
            value={params.keyword}
            onChange={(e) => setParams({ ...params, keyword: e.target.value })}
            onPressEnter={handleSearch}
            allowClear
            style={{ flex: 1 }}
          />
          <Select
            placeholder="审核状态"
            allowClear
            style={{ width: 150 }}
            value={params.auditStatus}
            onChange={(value) => setParams({ ...params, auditStatus: value, current: 1 })}
          >
            <Option value="APPROVED">已审核</Option>
            <Option value="PENDING">待审核</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
        </div>
      </Card>

      {/* 评价列表 */}
      {reviewList.length > 0 ? (
        <>
          <div className="review-list-container">
            {reviewList.map((review) => (
              <div key={review.reviewId} className="review-item-card">
                {/* 头部：用户信息和评分 */}
                <div className="review-item-header">
                  <div className="review-user-section">
                    <Avatar
                      src={review.avatar}
                      icon={<StarOutlined />}
                      size={52}
                      className="review-avatar"
                    />
                    <div className="review-user-detail">
                      <div className="review-username">{review.username}</div>
                      <div className="review-time">{review.createTime}</div>
                    </div>
                  </div>
                  <div className="review-rating-section">
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      allowHalf
                    />
                    <span className="review-score-tag">{review.rating}分</span>
                  </div>
                </div>

                {/* 关联菜品 */}
                <div
                  className="review-food-link"
                  onClick={() => goToFoodDetail(review.foodId)}
                >
                  <CoffeeOutlined />
                  <span className="review-food-name">{review.foodName}</span>
                </div>

                {/* 评价内容 */}
                <div className="review-content-section">
                  <p className="review-text">{review.content}</p>

                  {/* 评价图片 */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="review-images">
                      <Image.PreviewGroup>
                        {review.imageUrls.map((url, index) => (
                          <div key={index} className="review-image-wrapper">
                            <Image
                              src={url}
                              alt={`评价图片${index + 1}`}
                              className="review-image-item"
                            />
                          </div>
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  )}
                </div>

                {/* 底部交互 */}
                <div className="review-item-footer">
                  <div className="review-interactions">
                    <Button
                      type="text"
                      icon={<LikeOutlined />}
                      onClick={() => handleLike(review.reviewId)}
                      disabled={review.isLiked}
                      className={`interaction-btn ${review.isLiked ? 'liked' : ''}`}
                    >
                      {review.likeCount > 0 ? review.likeCount : '赞'}
                    </Button>
                    <Button
                      type="text"
                      icon={<DislikeOutlined />}
                      onClick={() => handleDislike(review.reviewId)}
                      disabled={review.isDisliked}
                      className={`interaction-btn ${review.isDisliked ? 'disliked' : ''}`}
                    >
                      {review.dislikeCount > 0 ? review.dislikeCount : '踩'}
                    </Button>
                    {(review.isLiked || review.isDisliked) && (
                      <Button
                        type="text"
                        onClick={() => handleCancelInteraction(review.reviewId)}
                        className="interaction-btn cancel-btn"
                      >
                        取消
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="pagination">
            <span>共 {total} 条评价</span>
            <div className="page-buttons">
              <Button
                disabled={params.current <= 1}
                onClick={() => setParams({ ...params, current: params.current - 1 })}
              >
                上一页
              </Button>
              <span>第 {params.current} 页</span>
              <Button
                disabled={params.current * params.pageSize >= total}
                onClick={() => setParams({ ...params, current: params.current + 1 })}
              >
                下一页
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Empty description="暂无评价" />
      )}
    </div>
  )
}

export default ReviewList
