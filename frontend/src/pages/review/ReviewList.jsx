import { useEffect, useState } from 'react'
import { Card, List, Input, Select, Tag, Rate, Button, Empty, Spin, Avatar } from 'antd'
import { SearchOutlined, ShopOutlined, StarOutlined, ArrowLeftOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getReviewList, likeReview, dislikeReview, cancelInteraction } from '@/api/review'
import './ReviewList.css'

const { Option } = Select

function ReviewList() {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const [loading, setLoading] = useState(true)
  const [reviewList, setReviewList] = useState([])
  const [total, setTotal] = useState(0)
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
      const data = await getReviewList(params)
      setReviewList(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('获取评价列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setParams({ ...params, current: 1 })
  }

  const handlePageChange = (page, pageSize) => {
    setParams({ ...params, page, pageSize })
  }

  const goBack = () => {
    navigate(-1)
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
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="review-list">
      <div className="page-header">
        <h1>评价列表</h1>
        <p>查看所有用户评价</p>
      </div>

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
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
        </div>
        <div className="filter-row">
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
        </div>
      </Card>

      {/* 评价列表 */}
      {reviewList.length > 0 ? (
        <>
          <List
            dataSource={reviewList}
            renderItem={(review) => (
              <List.Item className="review-item">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={review.avatar}
                      icon={<StarOutlined />}
                      size="large"
                    />
                  }
                  title={
                    <div className="review-header">
                      <span className="username">{review.username}</span>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        allowHalf
                        style={{ fontSize: 12 }}
                      />
                      <span className="review-time">{review.createTime}</span>
                    </div>
                  }
                  description={
                    <div className="review-content">
                      <div className="review-food">
                        <ShopOutlined />
                        <span
                          className="food-name"
                          onClick={() => goToFoodDetail(review.foodId)}
                        >
                          {review.foodName}
                        </span>
                      </div>
                      <div className="review-text">{review.content}</div>
                      {review.imageUrls && review.imageUrls.length > 0 && (
                        <div className="review-images">
                          {review.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`评价图片${index + 1}`} />
                          ))}
                        </div>
                      )}
                      <div className="review-interactions">
                        <Button
                          type="text"
                          size="small"
                          icon={<LikeOutlined />}
                          onClick={() => handleLike(review.reviewId)}
                          disabled={review.isLiked}
                        >
                          {review.likeCount}
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<DislikeOutlined />}
                          onClick={() => handleDislike(review.reviewId)}
                          disabled={review.isDisliked}
                        >
                          {review.dislikeCount}
                        </Button>
                        {(review.isLiked || review.isDisliked) && (
                          <Button
                            type="text"
                            size="small"
                            onClick={() => handleCancelInteraction(review.reviewId)}
                          >
                            取消
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

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
