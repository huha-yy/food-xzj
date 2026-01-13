import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Tag,
  Space,
  Tabs,
  Upload,
  Image,
  Popconfirm
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  DollarOutlined,
  StarOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import {
  getMerchantFoodList,
  createFood,
  updateFood,
  deleteFood,
  updateFoodStatus,
  getMerchantInfo,
  updateMerchantInfo,
  getCurrentMerchant
} from '@/api/merchantDashboard'
import { uploadImage } from '@/api/upload'
import { getCategoryList } from '@/api/category'
import './Dashboard.css'

const { TextArea } = Input

function Dashboard() {
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(false)
  const [foodList, setFoodList] = useState([])
  const [total, setTotal] = useState(0)
  const [merchantInfo, setMerchantInfo] = useState(null)
  const [categoryList, setCategoryList] = useState([])

  // 菜品表单
  const [foodFormVisible, setFoodFormVisible] = useState(false)
  const [foodForm, setFoodForm] = useState({})
  const [editingFood, setEditingFood] = useState(null)
  const [foodImageUploading, setFoodImageUploading] = useState(false)

  // 商家信息表单
  const [merchantFormVisible, setMerchantFormVisible] = useState(false)
  const [merchantForm, setMerchantForm] = useState({})
  const [coverImageUploading, setCoverImageUploading] = useState(false)

  // 分页参数
  const [params, setParams] = useState({
    current: 1,
    pageSize: 10,
    keyword: '',
    status: undefined
  })

  // 获取当前商家信息
  useEffect(() => {
    fetchCurrentMerchant()
    fetchCategories()
  }, [])

  const fetchCurrentMerchant = async () => {
    try {
      const data = await getCurrentMerchant()
      setMerchantInfo(data)
    } catch (error) {
      console.error('获取商家信息失败:', error)
      message.error('获取商家信息失败，请确保您已创建商家账号')
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategoryList()
      setCategoryList(data || [])
    } catch (error) {
      console.error('获取分类列表失败:', error)
      message.error('获取分类列表失败')
    }
  }

  // 获取统计数据
  const statsData = {
    totalFood: foodList.length,
    onShelf: foodList.filter(f => f.status === 'ON_SHELF').length,
    offShelf: foodList.filter(f => f.status === 'OFF_SHELF').length
  }

  // 获取菜品列表（在商家信息加载后）
  useEffect(() => {
    if (merchantInfo?.merchantId) {
      fetchFoodList()
    }
  }, [params, merchantInfo?.merchantId])

  const fetchFoodList = async () => {
    if (!merchantInfo?.merchantId) return

    try {
      setLoading(true)
      const response = await getMerchantFoodList({
        ...params,
        merchantId: merchantInfo.merchantId
      })
      setFoodList(response.records || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('获取菜品列表失败:', error)
      message.error('获取菜品列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 打开菜品表单
  const openFoodForm = (food = null) => {
    if (food) {
      setEditingFood(food)
      setFoodForm({
        ...food
      })
    } else {
      setEditingFood(null)
      setFoodForm({
        merchantId: merchantInfo?.merchantId,
        name: '',
        categoryId: undefined,
        price: '',
        description: '',
        imageUrl: '',
        status: 'ON_SHELF'
      })
    }
    setFoodFormVisible(true)
  }

  // 提交菜品表单
  const handleFoodSubmit = async () => {
    try {
      if (editingFood) {
        await updateFood(editingFood.foodId, foodForm)
        message.success('修改菜品成功')
      } else {
        await createFood(foodForm)
        message.success('创建菜品成功')
      }
      setFoodFormVisible(false)
      fetchFoodList()
    } catch (error) {
      message.error(editingFood ? '修改菜品失败' : '创建菜品失败')
    }
  }

  // 删除菜品
  const handleDeleteFood = async (foodId) => {
    try {
      await deleteFood(foodId)
      message.success('删除菜品成功')
      fetchFoodList()
    } catch (error) {
      message.error('删除菜品失败')
    }
  }

  // 上下架菜品
  const handleUpdateStatus = async (foodId, status) => {
    try {
      await updateFoodStatus(foodId, status)
      message.success(status === 'ON_SHELF' ? '上架成功' : '下架成功')
      fetchFoodList()
    } catch (error) {
      message.error('操作失败')
    }
  }

  // 打开商家信息表单
  const openMerchantForm = () => {
    setMerchantForm({
      ...merchantInfo
    })
    setMerchantFormVisible(true)
  }

  // 提交商家信息表单
  const handleMerchantSubmit = async () => {
    try {
      await updateMerchantInfo(merchantInfo?.merchantId, merchantForm)
      message.success('修改商家信息成功')
      setMerchantFormVisible(false)
      fetchCurrentMerchant()
    } catch (error) {
      message.error('修改商家信息失败')
    }
  }

  // 处理菜品图片上传
  const handleFoodImageUpload = async (file) => {
    try {
      setFoodImageUploading(true)
      const result = await uploadImage(file)
      setFoodForm({ ...foodForm, imageUrl: result.imageUrl })
      message.success('图片上传成功')
    } catch (error) {
      console.error('菜品图片上传失败:', error)
      message.error('图片上传失败')
    } finally {
      setFoodImageUploading(false)
    }
  }

  // 处理封面图上传
  const handleCoverImageUpload = async (file) => {
    try {
      setCoverImageUploading(true)
      const result = await uploadImage(file)
      setMerchantForm({ ...merchantForm, coverImage: result.imageUrl })
      message.success('封面图上传成功')
    } catch (error) {
      console.error('封面图上传失败:', error)
      message.error('封面图上传失败')
    } finally {
      setCoverImageUploading(false)
    }
  }

  // 上传前校验
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件！')
      return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！')
      return false
    }
    return true
  }

  // 菜品表格列
  const foodColumns = [
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        imageUrl ? <Image src={imageUrl} width={60} height={60} style={{ objectFit: 'cover' }} /> : '-'
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      key: 'salesCount'
    },
    {
      title: '评分',
      dataIndex: 'ratingAvg',
      key: 'ratingAvg',
      render: (rating) => rating ? `${rating}分` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ON_SHELF' ? 'green' : 'red'}>
          {status === 'ON_SHELF' ? '已上架' : '已下架'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openFoodForm(record)}
          >
            编辑
          </Button>
          {record.status === 'ON_SHELF' ? (
            <Popconfirm
              title="确定要下架该菜品吗？"
              onConfirm={() => handleUpdateStatus(record.foodId, 'OFF_SHELF')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<ArrowDownOutlined />}>
                下架
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定要上架该菜品吗？"
              onConfirm={() => handleUpdateStatus(record.foodId, 'ON_SHELF')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<ArrowUpOutlined />}>
                上架
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确定要删除该菜品吗？"
            onConfirm={() => handleDeleteFood(record.foodId)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="merchant-dashboard">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'stats',
            label: '数据统计',
            children: (
              <>
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="菜品总数"
                        value={statsData.totalFood}
                        prefix={<ShopOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="已上架"
                        value={statsData.onShelf}
                        prefix={<ArrowUpOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <Statistic
                        title="已下架"
                        value={statsData.offShelf}
                        prefix={<ArrowDownOutlined />}
                        valueStyle={{ color: '#8c8c8c' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card
                  title="店铺信息"
                  extra={
                    <Button type="primary" icon={<EditOutlined />} onClick={openMerchantForm}>
                      编辑信息
                    </Button>
                  }
                  style={{ marginTop: 24 }}
                >
                  {merchantInfo && (
                    <div className="merchant-info-detail">
                      <div className="info-item">
                        <span className="label">店铺名称：</span>
                        <span className="value">{merchantInfo.shopName}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">店铺地址：</span>
                        <span className="value">{merchantInfo.address}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">店铺描述：</span>
                        <span className="value">{merchantInfo.description || '暂无描述'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">营业时间：</span>
                        <span className="value">{merchantInfo.openingHours || '暂无设置'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">审核状态：</span>
                        <Tag color={
                          merchantInfo.auditStatus === 'APPROVED' ? 'green' :
                          merchantInfo.auditStatus === 'PENDING' ? 'orange' : 'red'
                        }>
                          {merchantInfo.auditStatus === 'APPROVED' ? '已通过' :
                           merchantInfo.auditStatus === 'PENDING' ? '待审核' : '已驳回'}
                        </Tag>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )
          },
          {
            key: 'foods',
            label: '菜品管理',
            children: (
              <Card
                title="菜品列表"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openFoodForm()}>
                    添加菜品
                  </Button>
                }
              >
                <div className="search-bar">
                  <Input.Search
                    placeholder="搜索菜品名称"
                    allowClear
                    onSearch={(value) => setParams(prev => ({ ...prev, keyword: value, current: 1 }))}
                    style={{ width: 300 }}
                  />
                  <Select
                    placeholder="筛选状态"
                    allowClear
                    style={{ width: 150, marginLeft: 16 }}
                    onChange={(value) => setParams(prev => ({ ...prev, status: value, current: 1 }))}
                    value={params.status}
                  >
                    <Select.Option value="ON_SHELF">已上架</Select.Option>
                    <Select.Option value="OFF_SHELF">已下架</Select.Option>
                  </Select>
                </div>

                <Table
                  columns={foodColumns}
                  dataSource={foodList}
                  rowKey="foodId"
                  loading={loading}
                  pagination={{
                    current: params.current,
                    pageSize: params.pageSize,
                    total,
                    onChange: (page, pageSize) => setParams(prev => ({ ...prev, current: page, pageSize })),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`
                  }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* 菜品表单弹窗 */}
      <Modal
        title={editingFood ? '编辑菜品' : '添加菜品'}
        open={foodFormVisible}
        onOk={handleFoodSubmit}
        onCancel={() => setFoodFormVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="菜品名称">
            <Input
              value={foodForm.name}
              onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
              placeholder="请输入菜品名称"
            />
          </Form.Item>
          <Form.Item label="菜品价格">
            <InputNumber
              value={foodForm.price}
              onChange={(value) => setFoodForm({ ...foodForm, price: value })}
              placeholder="请输入菜品价格"
              min={0}
              precision={2}
              style={{ width: '100%' }}
              prefix="¥"
            />
          </Form.Item>
          <Form.Item label="菜品分类">
            <Select
              value={foodForm.categoryId}
              onChange={(value) => setFoodForm({ ...foodForm, categoryId: value })}
              placeholder="请选择菜品分类"
              style={{ width: '100%' }}
            >
              {categoryList.map(category => (
                <Select.Option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="菜品描述">
            <TextArea
              value={foodForm.description}
              onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
              placeholder="请输入菜品描述"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="菜品图片">
            <Upload
              name="file"
              listType="picture-card"
              className="food-image-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ file }) => handleFoodImageUpload(file)}
            >
              {foodForm.imageUrl ? (
                <img src={foodForm.imageUrl} alt="菜品图片" style={{ width: '100%' }} />
              ) : (
                <div>
                  {foodImageUploading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={foodForm.status}
              onChange={(value) => setFoodForm({ ...foodForm, status: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="ON_SHELF">上架</Select.Option>
              <Select.Option value="OFF_SHELF">下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 商家信息表单弹窗 */}
      <Modal
        title="编辑商家信息"
        open={merchantFormVisible}
        onOk={handleMerchantSubmit}
        onCancel={() => setMerchantFormVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="店铺名称">
            <Input
              value={merchantForm.shopName}
              onChange={(e) => setMerchantForm({ ...merchantForm, shopName: e.target.value })}
              placeholder="请输入店铺名称"
            />
          </Form.Item>
          <Form.Item label="店铺地址">
            <Input
              value={merchantForm.address}
              onChange={(e) => setMerchantForm({ ...merchantForm, address: e.target.value })}
              placeholder="请输入店铺地址"
            />
          </Form.Item>
          <Form.Item label="店铺描述">
            <TextArea
              value={merchantForm.description}
              onChange={(e) => setMerchantForm({ ...merchantForm, description: e.target.value })}
              placeholder="请输入店铺描述"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="营业时间">
            <Input
              value={merchantForm.openingHours}
              onChange={(e) => setMerchantForm({ ...merchantForm, openingHours: e.target.value })}
              placeholder="例如：9:00-21:00"
            />
          </Form.Item>
          <Form.Item label="封面图">
            <Upload
              name="file"
              listType="picture-card"
              className="merchant-image-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ file }) => handleCoverImageUpload(file)}
            >
              {merchantForm.coverImage ? (
                <img src={merchantForm.coverImage} alt="封面图" style={{ width: '100%' }} />
              ) : (
                <div>
                  {coverImageUploading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>上传封面图</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Dashboard
