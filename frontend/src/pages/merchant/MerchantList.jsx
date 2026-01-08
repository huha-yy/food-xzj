import { useEffect, useState } from 'react'
import { Card, List, Input, Select, Tag, Rate, Button, Empty, Spin, Row, Col } from 'antd'
import { SearchOutlined, ShopOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getMerchantList } from '@/api/merchant'
import './MerchantList.css'

const { Option } = Select

function MerchantList() {
  const [loading, setLoading] = useState(true)
  const [merchantList, setMerchantList] = useState([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState({
    current: 1,
    pageSize: 12,
    keyword: '',
    auditStatus: undefined
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchMerchantList()
  }, [params])

  const fetchMerchantList = async () => {
    try {
      setLoading(true)
      const data = await getMerchantList(params)
      setMerchantList(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('获取商家列表失败:', error)
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

  const goToMerchantDetail = (merchantId) => {
    navigate(`/merchants/${merchantId}`)
  }

  const renderMerchantCard = (merchant) => (
    <List.Item key={merchant.merchantId}>
      <Card
        hoverable
        cover={
          merchant.coverImage ? (
            <img
              alt={merchant.shopName}
              src={merchant.coverImage}
              className="merchant-image"
            />
          ) : (
            <div className="merchant-image-placeholder">
              <ShopOutlined />
              <span>暂无图片</span>
            </div>
          )
        }
        onClick={() => goToMerchantDetail(merchant.merchantId)}
      >
        <Card.Meta
          title={
            <div className="merchant-title">
              <span>{merchant.shopName}</span>
              <Tag>{merchant.status === 'ACTIVE' ? '营业中' : '已停业'}</Tag>
            </div>
          }
          description={
            <div>
              <div className="merchant-info">
                <EnvironmentOutlined />
                <span>{merchant.address || '暂无地址'}</span>
              </div>
              <div className="merchant-rating">
                <Rate disabled defaultValue={4.5} allowHalf />
                <span className="rating-count">4.5分</span>
              </div>
              <div className="merchant-hours">
                <ClockCircleOutlined />
                <span>{merchant.openingHours || '暂无营业时间'}</span>
              </div>
            </div>
          }
        />
      </Card>
    </List.Item>
  )

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="merchant-list">
      <div className="page-header">
        <h1>商家列表</h1>
        <p>发现校园美食商家</p>
      </div>

      {/* 搜索和筛选 */}
      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索商家名称"
              prefix={<SearchOutlined />}
              value={params.keyword}
              onChange={(e) => setParams({ ...params, keyword: e.target.value })}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="审核状态"
              allowClear
              style={{ width: '100%' }}
              value={params.auditStatus}
              onChange={(value) => setParams({ ...params, auditStatus: value, current: 1 })}
            >
              <Option value="APPROVED">已审核</Option>
              <Option value="PENDING">待审核</Option>
              <Option value="REJECTED">已拒绝</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              onClick={handleSearch}
              block
            >
              搜索
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 商家列表 */}
      {merchantList.length > 0 ? (
        <>
          <List
            grid={{ gutter: [24, 24], xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={merchantList}
            renderItem={renderMerchantCard}
          />

          {/* 分页 */}
          <div className="pagination">
            {/* 暂时使用简单分页 */}
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
        </>
      ) : (
        <Empty description="暂无商家数据" />
      )}
    </div>
  )
}

export default MerchantList
