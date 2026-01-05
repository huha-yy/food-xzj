import { useState, useEffect } from 'react'
import { Card, List, Tag, Rate, Button, Input, Select, Row, Col, Pagination, Empty, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getFoodList } from '@/api/food'
import './FoodList.css'

const { Option } = Select

function FoodList() {
  const [loading, setLoading] = useState(false)
  const [foodList, setFoodList] = useState([])
  const [total, setTotal] = useState(0)
const [params, setParams] = useState({
  current: 1,
  pageSize: 12,
  keyword: '',
  categoryId: undefined
})

  const navigate = useNavigate()

  useEffect(() => {
    fetchFoodList()
  }, [params])

  const fetchFoodList = async () => {
    try {
      setLoading(true)
      const data = await getFoodList(params)
      setFoodList(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('获取菜品列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setParams({ ...params, current: 1 })
  }

  const handlePageChange = (current, pageSize) => {
    setParams({ ...params, current, pageSize })
  }

  const goToFoodDetail = (id) => {
    navigate(`/foods/${id}`)
  }

  return (
    <div className="food-list">
      <div className="page-header">
        <h1>菜品列表</h1>
        <p>发现校园美食</p>
      </div>

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索菜品"
              prefix={<SearchOutlined />}
              value={params.keyword}
              onChange={(e) => setParams({ ...params, keyword: e.target.value })}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="选择分类"
              allowClear
              style={{ width: '100%' }}
              value={params.categoryId}
              onChange={(value) => setParams({ ...params, categoryId: value, current: 1 })}
            >
              <Option value={1}>小吃</Option>
              <Option value={2}>快餐</Option>
              <Option value={3}>饮品</Option>
              <Option value={4}>主食</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button type="primary" onClick={handleSearch} block>
              搜索
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 菜品列表 */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : foodList.length > 0 ? (
        <>
          <List
            grid={{ gutter: [24, 24], xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={foodList}
            renderItem={(food) => (
              <List.Item key={food.foodId}>
                <Card
                  hoverable
                  cover={
                    food.imageUrl ? (
                      <img
                        alt={food.name}
                        src={food.imageUrl}
                        className="food-image"
                      />
                    ) : null
                  }
                  onClick={() => goToFoodDetail(food.foodId)}
                >
                  <Card.Meta
                    title={
                      <div className="food-title">
                        <span>{food.name}</span>
                        <Tag color="red">¥{food.price}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div className="food-info">
                          <span>{food.categoryName}</span>
                        </div>
                        <div className="food-rating">
                          <Rate disabled defaultValue={parseFloat(food.ratingAvg || 0)} allowHalf />
                          <span className="rating-count">({food.ratingAvg || 0}分)</span>
                        </div>
                        <div className="food-sales">
                          销量: {food.salesCount || 0}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />

          {/* 分页 */}
          <div className="pagination">
            <Pagination
              current={params.page}
              pageSize={params.pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total) => `共 ${total} 条`}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无菜品数据" />
      )}
    </div>
  )
}

export default FoodList

