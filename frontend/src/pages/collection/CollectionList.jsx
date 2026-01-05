import { useEffect, useState } from 'react'
import { Card, List, Tag, Button, Empty, Spin, Tabs, Avatar, Rate, message, Modal } from 'antd'
import { DeleteOutlined, ShopOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getCollectionList, deleteCollection } from '@/api/collection'
import { getFoodList } from '@/api/food'
import './CollectionList.css'

function CollectionList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [collectionList, setCollectionList] = useState([])
  const [foodTotal, setFoodTotal] = useState(0)
  const [merchantTotal, setMerchantTotal] = useState(0)
  const [activeTab, setActiveTab] = useState('FOOD')
  const [params, setParams] = useState({
    current: 1,
    pageSize: 12
  })

  useEffect(() => {
    // 初始化时同时获取两种类型的数量
    fetchAllCounts()
  }, [])

  useEffect(() => {
    fetchCollectionList()
  }, [activeTab, params])

  const fetchAllCounts = async () => {
    try {
      const [foodData, merchantData] = await Promise.all([
        getCollectionList({ type: 'FOOD', current: 1, pageSize: 1 }),
        getCollectionList({ type: 'MERCHANT', current: 1, pageSize: 1 })
      ])
      setFoodTotal(foodData?.total || 0)
      setMerchantTotal(merchantData?.total || 0)
    } catch (error) {
      console.error('获取收藏数量失败:', error)
    }
  }

  const fetchCollectionList = async () => {
    try {
      setLoading(true)
      const data = await getCollectionList({
        ...params,
        type: activeTab
      })
      setCollectionList(data?.records || [])
      // 更新当前 tab 的数量
      if (activeTab === 'FOOD') {
        setFoodTotal(data?.total || 0)
      } else {
        setMerchantTotal(data?.total || 0)
      }
    } catch (error) {
      console.error('获取收藏列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelCollection = async (collection) => {
    Modal.confirm({
      title: '确认取消收藏',
      content: `确定要取消收藏${collection.targetName}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCollection(collection.collectionId)
          message.success('取消收藏成功')
          fetchAllCounts() // 重新获取数量
          fetchCollectionList() // 刷新列表
        } catch (error) {
          console.error('取消收藏失败:', error)
          message.error('操作失败')
        }
      }
    })
  }

  const handlePageChange = (page, pageSize) => {
    setParams({ ...params, page, pageSize })
  }

  const goToDetail = (collection) => {
    if (collection.type === 'MERCHANT') {
      navigate(`/merchants/${collection.targetId}`)
    } else {
      navigate(`/foods/${collection.targetId}`)
    }
  }

  const renderCollectionCard = (collection) => (
    <List.Item key={collection.collectionId}>
      <Card
        hoverable
        cover={
          collection.targetImage ? (
            <img
              alt={collection.targetName}
              src={collection.targetImage}
              className="collection-image"
            />
          ) : null
        }
        onClick={() => goToDetail(collection)}
      >
        <Card.Meta
          title={
            <div className="collection-title">
              <span className="target-name">{collection.targetName}</span>
              {collection.price && (
                <Tag color="red">¥{collection.price}</Tag>
              )}
            </div>
          }
          description={
            <div className="collection-detail">
              <div className="collection-info">
                <Tag color={collection.type === 'MERCHANT' ? 'blue' : 'green'}>
                  {collection.type === 'MERCHANT' ? '商家' : '菜品'}
                </Tag>
              </div>
              <div className="collection-actions">
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelCollection(collection)
                  }}
                >
                  取消收藏
                </Button>
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
    <div className="collection-list">
      <div className="page-header">
        <h1>我的收藏</h1>
        <p>管理我的收藏</p>
      </div>

      {/* Tab切换 */}
      <Card className="content-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'FOOD',
              label: `菜品收藏 (${foodTotal})`,
              children: collectionList.length > 0 ? (
                <>
                  <List
                    grid={{ gutter: [24, 24], xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={collectionList}
                    renderItem={renderCollectionCard}
                  />

                  {/* 分页 */}
                  <div className="pagination">
                    <span>共 {foodTotal} 条</span>
                    <div className="page-buttons">
                      <Button
                        disabled={params.current <= 1}
                        onClick={() => setParams({ ...params, current: params.current - 1 })}
                      >
                        上一页
                      </Button>
                      <span>第 {params.current} 页</span>
                      <Button
                        disabled={params.current * params.pageSize >= foodTotal}
                        onClick={() => setParams({ ...params, current: params.current + 1 })}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Empty description="暂无菜品收藏" />
              )
            },
            {
              key: 'MERCHANT',
              label: `商家收藏 (${merchantTotal})`,
              children: collectionList.length > 0 ? (
                <>
                  <List
                    grid={{ gutter: [24, 24], xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={collectionList}
                    renderItem={renderCollectionCard}
                  />

                  {/* 分页 */}
                  <div className="pagination">
                    <span>共 {merchantTotal} 条</span>
                    <div className="page-buttons">
                      <Button
                        disabled={params.current <= 1}
                        onClick={() => setParams({ ...params, current: params.current - 1 })}
                      >
                        上一页
                      </Button>
                      <span>第 {params.current} 页</span>
                      <Button
                        disabled={params.current * params.pageSize >= merchantTotal}
                        onClick={() => setParams({ ...params, current: params.current + 1 })}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Empty description="暂无商家收藏" />
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default CollectionList
