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
  Select,
  message,
  Tag,
  Space,
  Tabs,
  Popconfirm,
  DatePicker,
  Image
} from 'antd'
import {
  UserOutlined,
  ShopOutlined,
  ShoppingOutlined,
  StarOutlined,
  EditOutlined,
  CheckOutlined,
  StopOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons'
import {
  getStatistics,
  getUserList,
  getUserInfo,
  updateUserStatus,
  getMerchantList,
  getMerchantInfo,
  auditMerchant,
  updateMerchantStatus,
  getReviewList,
  getReviewDetail,
  auditReview,
  deleteReview,
  getAnnouncementList,
  getAnnouncementDetail,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  getActivityList,
  getActivityDetail,
  auditActivity,
  deleteActivity
} from '@/api/admin'
import './Dashboard.css'

const { TextArea } = Input

function Dashboard() {
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(false)

  // 统计数据
  const [stats, setStats] = useState({
    userCount: 0,
    merchantCount: 0,
    foodCount: 0,
    reviewCount: 0
  })

  // 用户管理
  const [userList, setUserList] = useState([])
  const [userTotal, setUserTotal] = useState(0)
  const [userParams, setUserParams] = useState({
    current: 1,
    pageSize: 10,
    keyword: '',
    role: undefined,
    status: undefined
  })
  const [userDetailVisible, setUserDetailVisible] = useState(false)
  const [userDetail, setUserDetail] = useState(null)

  // 商家管理
  const [merchantList, setMerchantList] = useState([])
  const [merchantTotal, setMerchantTotal] = useState(0)
  const [merchantParams, setMerchantParams] = useState({
    current: 1,
    pageSize: 10,
    keyword: '',
    auditStatus: undefined,
    status: undefined
  })
  const [merchantDetailVisible, setMerchantDetailVisible] = useState(false)
  const [merchantDetail, setMerchantDetail] = useState(null)
  const [auditMerchantVisible, setAuditMerchantVisible] = useState(false)
  const [auditMerchantForm, setAuditMerchantForm] = useState({})

  // 评价管理
  const [reviewList, setReviewList] = useState([])
  const [reviewTotal, setReviewTotal] = useState(0)
  const [reviewParams, setReviewParams] = useState({
    current: 1,
    pageSize: 10,
    auditStatus: ''
  })
  const [auditReviewVisible, setAuditReviewVisible] = useState(false)
  const [auditReviewForm, setAuditReviewForm] = useState({})
  const [reviewDetail, setReviewDetail] = useState(null)
  const [reviewDetailVisible, setReviewDetailVisible] = useState(false)

  // 公告管理
  const [announcementList, setAnnouncementList] = useState([])
  const [announcementTotal, setAnnouncementTotal] = useState(0)
  const [announcementParams, setAnnouncementParams] = useState({
    current: 1,
    pageSize: 10
  })
  const [announcementFormVisible, setAnnouncementFormVisible] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({})
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)

  // 活动管理
  const [activityList, setActivityList] = useState([])
  const [activityTotal, setActivityTotal] = useState(0)
  const [activityParams, setActivityParams] = useState({
    current: 1,
    pageSize: 10,
    auditStatus: undefined
  })
  const [auditActivityVisible, setAuditActivityVisible] = useState(false)
  const [auditActivityForm, setAuditActivityForm] = useState({})
  const [activityDetail, setActivityDetail] = useState(null)
  const [activityDetailVisible, setActivityDetailVisible] = useState(false)

  // 获取统计数据
  useEffect(() => {
    fetchStatistics()
  }, [])

  // 获取用户列表
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUserList()
    }
  }, [userParams, activeTab])

  // 获取商家列表
  useEffect(() => {
    if (activeTab === 'merchants') {
      fetchMerchantList()
    }
  }, [merchantParams, activeTab])

  // 获取评价列表
  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviewList()
    }
  }, [reviewParams, activeTab])

  // 获取公告列表
  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncementList()
    }
  }, [announcementParams, activeTab])

  // 获取活动列表
  useEffect(() => {
    if (activeTab === 'activities') {
      fetchActivityList()
    }
  }, [activityParams, activeTab])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await getStatistics()
      console.log('统计数据响应:', response)
      setStats({
        userCount: response.userCount,
        merchantCount: response.merchantCount,
        foodCount: response.foodCount,
        reviewCount: response.reviewCount
      })
    } catch (error) {
      message.error('获取统计数据失败')
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserList = async () => {
    try {
      setLoading(true)
      const response = await getUserList(userParams)
      setUserList(response.records)
      setUserTotal(response.total)
    } catch (error) {
      message.error('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, status) => {
    try {
      await updateUserStatus(userId, status)
      message.success(status === 'ACTIVE' ? '启用用户成功' : '禁用用户成功')
      fetchUserList()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleViewUserDetail = async (userId) => {
    try {
      const response = await getUserInfo(userId)
      setUserDetail(response)
      setUserDetailVisible(true)
    } catch (error) {
      message.error('获取用户详情失败')
    }
  }

  const fetchMerchantList = async () => {
    try {
      setLoading(true)
      const response = await getMerchantList(merchantParams)
      setMerchantList(response.records)
      setMerchantTotal(response.total)
    } catch (error) {
      message.error('获取商家列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleViewMerchantDetail = async (merchantId) => {
    try {
      const response = await getMerchantInfo(merchantId)
      setMerchantDetail(response)
      setMerchantDetailVisible(true)
    } catch (error) {
      message.error('获取商家详情失败')
    }
  }

  const handleOpenAuditMerchant = (merchant) => {
    setAuditMerchantForm({
      merchantId: merchant.merchantId,
      auditStatus: 'APPROVED',
      auditReason: ''
    })
    setAuditMerchantVisible(true)
  }

  const handleAuditMerchant = async () => {
    try {
      await auditMerchant(auditMerchantForm)
      message.success('审核成功')
      setAuditMerchantVisible(false)
      fetchMerchantList()
    } catch (error) {
      message.error('审核失败')
    }
  }

  const handleMerchantStatusChange = async (merchantId, status) => {
    try {
      await updateMerchantStatus(merchantId, status)
      message.success('操作成功')
      fetchMerchantList()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const fetchReviewList = async () => {
    try {
      setLoading(true)
      const response = await getReviewList(reviewParams)
      setReviewList(response.records)
      setReviewTotal(response.total)
    } catch (error) {
      message.error('获取评价列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAuditReview = (review) => {
    setAuditReviewForm({
      reviewId: review.reviewId,
      auditStatus: 'APPROVED',
      auditReason: ''
    })
    setAuditReviewVisible(true)
  }

  const handleAuditReview = async () => {
    try {
      await auditReview(auditReviewForm)
      message.success('审核成功')
      setAuditReviewVisible(false)
      fetchReviewList()
    } catch (error) {
      message.error('审核失败')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId)
      message.success('删除成功')
      fetchReviewList()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleOpenReviewDetail = async (review) => {
    try {
      console.log('管理员后台 - 打开评价详情:', review)
      console.log('管理员后台 - 评价ID (review.reviewId):', review.reviewId)
      const detail = await getReviewDetail(review.reviewId)
      console.log('管理员后台 - 获取到的评价详情:', detail)
      setReviewDetail(detail)
      setReviewDetailVisible(true)
    } catch (error) {
      console.error('管理员后台 - 获取评价详情失败:', error)
      message.error('获取评价详情失败')
    }
  }

  const fetchAnnouncementList = async () => {
    try {
      setLoading(true)
      const response = await getAnnouncementList(announcementParams)
      setAnnouncementList(response.records)
      setAnnouncementTotal(response.total)
    } catch (error) {
      message.error('获取公告列表失败')
    } finally {
      setLoading(false)
    }
  }

  const openAnnouncementForm = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement)
      setAnnouncementForm({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        status: announcement.status
      })
    } else {
      setEditingAnnouncement(null)
      setAnnouncementForm({
        title: '',
        content: '',
        status: 'DRAFT'
      })
    }
    setAnnouncementFormVisible(true)
  }

  const handleAnnouncementSubmit = async () => {
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(announcementForm)
        message.success('修改公告成功')
      } else {
        await createAnnouncement(announcementForm)
        message.success('创建公告成功')
      }
      setAnnouncementFormVisible(false)
      fetchAnnouncementList()
    } catch (error) {
      message.error(editingAnnouncement ? '修改公告失败' : '创建公告失败')
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteAnnouncement(id)
      message.success('删除公告成功')
      fetchAnnouncementList()
    } catch (error) {
      message.error('删除公告失败')
    }
  }

  const handlePublishAnnouncement = async (id) => {
    try {
      await publishAnnouncement(id)
      message.success('发布公告成功')
      fetchAnnouncementList()
    } catch (error) {
      message.error('发布公告失败')
    }
  }

  const fetchActivityList = async () => {
    try {
      setLoading(true)
      const response = await getActivityList(activityParams)
      console.log('活动列表响应:', response)
      console.log('records:', response.records)
      console.log('total:', response.total)
      console.log('设置活动列表前 activityList:', activityList)
      setActivityList(response.records)
      setActivityTotal(response.total)
      console.log('设置活动列表后 activityList:', activityList)
    } catch (error) {
      message.error('获取活动列表失败')
      console.error('获取活动列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAuditActivity = async (activity) => {
    try {
      const detail = await getActivityDetail(activity.id)
      setAuditActivityForm({
        id: activity.id,
        auditResult: 'APPROVED',
        auditReason: '',
        activityName: detail.title
      })
      setAuditActivityVisible(true)
    } catch (error) {
      message.error('获取活动详情失败')
    }
  }

  const handleAuditActivity = async () => {
    try {
      await auditActivity(auditActivityForm)
      message.success('审核成功')
      setAuditActivityVisible(false)
      fetchActivityList()
    } catch (error) {
      message.error('审核失败')
    }
  }

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id)
      message.success('删除成功')
      fetchActivityList()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleOpenActivityDetail = async (activity) => {
    try {
      const detail = await getActivityDetail(activity.id)
      setActivityDetail(detail)
      setActivityDetailVisible(true)
    } catch (error) {
      message.error('获取活动详情失败')
    }
  }

  // 用户表格列
  const userColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          'ADMIN': { text: '管理员', color: 'red' },
          'MERCHANT': { text: '商家', color: 'blue' },
          'STUDENT': { text: '学生', color: 'green' }
        }
        const r = roleMap[role] || { text: role, color: 'default' }
        return <Tag color={r.color}>{r.text}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? '正常' : '已禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewUserDetail(record.userId)}
          >
            详情
          </Button>
          {record.status === 'ACTIVE' ? (
            <Popconfirm
              title="确定要禁用该用户吗？"
              onConfirm={() => handleUserStatusChange(record.userId, 'DISABLED')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<StopOutlined />}>
                禁用
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定要启用该用户吗？"
              onConfirm={() => handleUserStatusChange(record.userId, 'ACTIVE')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<CheckOutlined />}>
                启用
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  // 商家表格列
  const merchantColumns = [
    {
      title: '商家ID',
      dataIndex: 'merchantId',
      key: 'merchantId',
      width: 80
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (status) => {
        const statusMap = {
          'PENDING': { text: '待审核', color: 'orange' },
          'APPROVED': { text: '已通过', color: 'green' },
          'REJECTED': { text: '已驳回', color: 'red' }
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? '正常' : '已禁用'}
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
            icon={<EyeOutlined />}
            onClick={() => handleViewMerchantDetail(record.merchantId)}
          >
            详情
          </Button>
          {record.auditStatus === 'PENDING' && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleOpenAuditMerchant(record)}
            >
              审核
            </Button>
          )}
          {record.status === 'ACTIVE' ? (
            <Popconfirm
              title="确定要禁用该商家吗？"
              onConfirm={() => handleMerchantStatusChange(record.merchantId, 'DISABLED')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<StopOutlined />}>
                禁用
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定要启用该商家吗？"
              onConfirm={() => handleMerchantStatusChange(record.merchantId, 'ACTIVE')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<CheckOutlined />}>
                启用
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  // 评价表格列
  const reviewColumns = [
    {
      title: '评价ID',
      dataIndex: 'reviewId',
      key: 'reviewId',
      width: 80
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '菜品',
      dataIndex: 'foodName',
      key: 'foodName'
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `${rating}分`
    },
    {
      title: '图片',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      width: 120,
      render: (imageUrls) => {
        if (!imageUrls || imageUrls.length === 0) {
          return <span style={{ color: '#999' }}>无图片</span>
        }
        return (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Image.PreviewGroup>
              {imageUrls.slice(0, 2).map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`评价图片${index + 1}`}
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              ))}
            </Image.PreviewGroup>
            {imageUrls.length > 2 && (
              <span style={{ color: '#666', fontSize: '12px' }}>+{imageUrls.length - 2}</span>
            )}
          </div>
        )
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (status) => {
        const statusMap = {
          'PENDING': { text: '待审核', color: 'orange' },
          'APPROVED': { text: '已通过', color: 'green' },
          'REJECTED': { text: '已驳回', color: 'red' }
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleOpenReviewDetail(record)}
          >
            详情
          </Button>
          {record.auditStatus === 'PENDING' && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleOpenAuditReview(record)}
            >
              审核
            </Button>
          )}
          <Popconfirm
            title="确定要删除该评价吗？"
            onConfirm={() => handleDeleteReview(record.reviewId)}
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

  // 公告表格列
  const announcementColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PUBLISHED': { text: '已发布', color: 'green' },
          'DRAFT': { text: '草稿', color: 'orange' }
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openAnnouncementForm(record)}
          >
            编辑
          </Button>
          {record.status === 'DRAFT' && (
            <Popconfirm
              title="确定要发布公告吗？"
              onConfirm={() => handlePublishAnnouncement(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<CheckOutlined />}>
                发布
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确定要删除该公告吗？"
            onConfirm={() => handleDeleteAnnouncement(record.id)}
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

  // 活动表格列
  const activityColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 150
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '活动内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 200
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-'
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (status) => {
        const statusMap = {
          'PENDING': { text: '待审核', color: 'orange' },
          'APPROVED': { text: '已通过', color: 'green' },
          'REJECTED': { text: '已驳回', color: 'red' }
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleOpenActivityDetail(record)}
          >
            详情
          </Button>
          {record.auditStatus === 'PENDING' && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleOpenAuditActivity(record)}
            >
              审核
            </Button>
          )}
          <Popconfirm
            title="确定要删除该活动吗？"
            onConfirm={() => handleDeleteActivity(record.id)}
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
    <div className="admin-dashboard">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'stats',
            label: '数据统计',
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="用户总数"
                      value={stats.userCount}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="商家总数"
                      value={stats.merchantCount}
                      prefix={<ShopOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="菜品总数"
                      value={stats.foodCount}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: '#1677ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="评价总数"
                      value={stats.reviewCount}
                      prefix={<StarOutlined />}
                      valueStyle={{ color: '#eb2f96' }}
                    />
                  </Card>
                </Col>
              </Row>
            )
          },
          {
            key: 'users',
            label: '用户管理',
            children: (
              <Card title="用户列表">
                <div className="search-bar">
                  <Input.Search
                    placeholder="搜索用户名"
                    allowClear
                    onSearch={(value) => setUserParams({ ...userParams, keyword: value, current: 1 })}
                    style={{ width: 200 }}
                  />
                  <Select
                    placeholder="筛选角色"
                    allowClear
                    style={{ width: 120, marginLeft: 16 }}
                    onChange={(value) => setUserParams({ ...userParams, role: value, current: 1 })}
                    value={userParams.role}
                  >
                    <Select.Option value="STUDENT">学生</Select.Option>
                    <Select.Option value="MERCHANT">商家</Select.Option>
                    <Select.Option value="ADMIN">管理员</Select.Option>
                  </Select>
                  <Select
                    placeholder="筛选状态"
                    allowClear
                    style={{ width: 120, marginLeft: 16 }}
                    onChange={(value) => setUserParams({ ...userParams, status: value, current: 1 })}
                    value={userParams.status}
                  >
                    <Select.Option value="ACTIVE">正常</Select.Option>
                    <Select.Option value="INACTIVE">已禁用</Select.Option>
                  </Select>
                </div>
                <Table
                  columns={userColumns}
                  dataSource={userList}
                  rowKey="userId"
                  loading={loading}
                  pagination={{
                    current: userParams.current,
                    pageSize: userParams.pageSize,
                    total: userTotal,
                    onChange: (page, pageSize) => setUserParams({ ...userParams, current: page, pageSize }),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`
                  }}
                />
              </Card>
            )
          },
          {
            key: 'merchants',
            label: '商家管理',
            children: (
              <Card title="商家列表">
                <div className="search-bar">
                  <Input.Search
                    placeholder="搜索店铺名称"
                    allowClear
                    onSearch={(value) => setMerchantParams({ ...merchantParams, keyword: value, current: 1 })}
                    style={{ width: 200 }}
                  />
                  <Select
                    placeholder="筛选审核状态"
                    allowClear
                    style={{ width: 120, marginLeft: 16 }}
                    onChange={(value) => setMerchantParams({ ...merchantParams, auditStatus: value, current: 1 })}
                    value={merchantParams.auditStatus}
                  >
                    <Select.Option value="PENDING">待审核</Select.Option>
                    <Select.Option value="APPROVED">已通过</Select.Option>
                    <Select.Option value="REJECTED">已驳回</Select.Option>
                  </Select>
                  <Select
                    placeholder="筛选状态"
                    allowClear
                    style={{ width: 120, marginLeft: 16 }}
                    onChange={(value) => setMerchantParams({ ...merchantParams, status: value, current: 1 })}
                    value={merchantParams.status}
                  >
                    <Select.Option value="ACTIVE">正常</Select.Option>
                    <Select.Option value="INACTIVE">已禁用</Select.Option>
                  </Select>
                </div>
                <Table
                  columns={merchantColumns}
                  dataSource={merchantList}
                  rowKey="merchantId"
                  loading={loading}
                  pagination={{
                    current: merchantParams.current,
                    pageSize: merchantParams.pageSize,
                    total: merchantTotal,
                    onChange: (page, pageSize) => setMerchantParams({ ...merchantParams, current: page, pageSize }),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`
                  }}
                />
              </Card>
            )
          },
          {
            key: 'reviews',
            label: '评价管理',
            children: (
              <Card title="评价列表">
                <div className="search-bar">
                  <Select
                    placeholder="筛选审核状态"
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => setReviewParams({ ...reviewParams, auditStatus: value || '', current: 1 })}
                    value={reviewParams.auditStatus || undefined}
                  >
                    <Select.Option value="PENDING">待审核</Select.Option>
                    <Select.Option value="APPROVED">已通过</Select.Option>
                    <Select.Option value="REJECTED">已驳回</Select.Option>
                  </Select>
                </div>
                <Table
                  columns={reviewColumns}
                  dataSource={reviewList}
                  rowKey="reviewId"
                  loading={loading}
                  pagination={{
                    current: reviewParams.current,
                    pageSize: reviewParams.pageSize,
                    total: reviewTotal,
                    onChange: (page, pageSize) => setReviewParams({ ...reviewParams, current: page, pageSize }),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`
                  }}
                />
              </Card>
            )
          },
          {
            key: 'announcements',
            label: '公告管理',
            children: (
              <Card
                title="公告列表"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openAnnouncementForm()}>
                    创建公告
                  </Button>
                }
              >
                <Table
                  columns={announcementColumns}
                  dataSource={announcementList}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    current: announcementParams.current,
                    pageSize: announcementParams.pageSize,
                    total: announcementTotal,
                    onChange: (page, pageSize) => setAnnouncementParams({ ...announcementParams, current: page, pageSize }),
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`
                  }}
                />
              </Card>
            )
          },
          {
            key: 'activities',
            label: '活动管理',
            children: (
              <Card title="活动列表">
                <div className="search-bar">
                  <Select
                    placeholder="筛选审核状态"
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => setActivityParams({ ...activityParams, auditStatus: value, current: 1 })}
                    value={activityParams.auditStatus}
                  >
                    <Select.Option value="PENDING">待审核</Select.Option>
                    <Select.Option value="APPROVED">已通过</Select.Option>
                    <Select.Option value="REJECTED">已驳回</Select.Option>
                  </Select>
                </div>
                <Table
                  columns={activityColumns}
                  dataSource={activityList}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    current: activityParams.current,
                    pageSize: activityParams.pageSize,
                    total: activityTotal,
                    onChange: (page, pageSize) => setActivityParams({ ...activityParams, current: page, pageSize }),
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

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={userDetailVisible}
        onCancel={() => setUserDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {userDetail && (
          <div className="detail-content">
            <div className="detail-item">
              <span className="label">用户ID：</span>
              <span className="value">{userDetail.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">用户名：</span>
              <span className="value">{userDetail.username}</span>
            </div>
            <div className="detail-item">
              <span className="label">角色：</span>
              <span className="value">{userDetail.role}</span>
            </div>
            <div className="detail-item">
              <span className="label">状态：</span>
              <span className="value">{userDetail.status}</span>
            </div>
            <div className="detail-item">
              <span className="label">昵称：</span>
              <span className="value">{userDetail.nickname || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="label">手机号：</span>
              <span className="value">{userDetail.phone || '-'}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* 商家详情弹窗 */}
      <Modal
        title="商家详情"
        open={merchantDetailVisible}
        onCancel={() => setMerchantDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMerchantDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {merchantDetail && (
          <div className="detail-content">
            <div className="detail-item">
              <span className="label">商家ID：</span>
              <span className="value">{merchantDetail.merchantId}</span>
            </div>
            <div className="detail-item">
              <span className="label">店铺名称：</span>
              <span className="value">{merchantDetail.shopName}</span>
            </div>
            <div className="detail-item">
              <span className="label">店铺地址：</span>
              <span className="value">{merchantDetail.address}</span>
            </div>
            <div className="detail-item">
              <span className="label">店铺描述：</span>
              <span className="value">{merchantDetail.description || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="label">营业时间：</span>
              <span className="value">{merchantDetail.openingHours || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="label">审核状态：</span>
              <span className="value">{merchantDetail.auditStatus}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* 商家审核弹窗 */}
      <Modal
        title="审核商家"
        open={auditMerchantVisible}
        onOk={handleAuditMerchant}
        onCancel={() => setAuditMerchantVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="审核结果">
            <Select
              value={auditMerchantForm.auditStatus}
              onChange={(value) => setAuditMerchantForm({ ...auditMerchantForm, auditStatus: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="APPROVED">通过</Select.Option>
              <Select.Option value="REJECTED">驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="审核原因">
            <TextArea
              value={auditMerchantForm.auditReason}
              onChange={(e) => setAuditMerchantForm({ ...auditMerchantForm, auditReason: e.target.value })}
              placeholder="请输入审核原因"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 评价审核弹窗 */}
      <Modal
        title="审核评价"
        open={auditReviewVisible}
        onOk={handleAuditReview}
        onCancel={() => setAuditReviewVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="审核结果">
            <Select
              value={auditReviewForm.auditStatus}
              onChange={(value) => setAuditReviewForm({ ...auditReviewForm, auditStatus: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="APPROVED">通过</Select.Option>
              <Select.Option value="REJECTED">驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="审核原因">
            <TextArea
              value={auditReviewForm.auditReason}
              onChange={(e) => setAuditReviewForm({ ...auditReviewForm, auditReason: e.target.value })}
              placeholder="请输入审核原因"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 公告表单弹窗 */}
      <Modal
        title={editingAnnouncement ? '编辑公告' : '创建公告'}
        open={announcementFormVisible}
        onOk={handleAnnouncementSubmit}
        onCancel={() => setAnnouncementFormVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="公告标题">
            <Input
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              placeholder="请输入公告标题"
            />
          </Form.Item>
          <Form.Item label="公告内容">
            <TextArea
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              placeholder="请输入公告内容"
              rows={6}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={announcementForm.status}
              onChange={(value) => setAnnouncementForm({ ...announcementForm, status: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">已发布</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 活动审核弹窗 */}
      <Modal
        title="审核活动"
        open={auditActivityVisible}
        onOk={handleAuditActivity}
        onCancel={() => setAuditActivityVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="活动名称">
            <span>{auditActivityForm.activityName}</span>
          </Form.Item>
          <Form.Item label="审核结果">
            <Select
              value={auditActivityForm.auditResult}
              onChange={(value) => setAuditActivityForm({ ...auditActivityForm, auditResult: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="APPROVED">通过</Select.Option>
              <Select.Option value="REJECTED">驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="审核原因">
            <TextArea
              value={auditActivityForm.auditReason}
              onChange={(e) => setAuditActivityForm({ ...auditActivityForm, auditReason: e.target.value })}
              placeholder="请输入审核原因"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 评价详情弹窗 */}
      <Modal
        title="评价详情"
        open={reviewDetailVisible}
        onCancel={() => setReviewDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReviewDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {reviewDetail && (
          <div className="detail-content">
            <div className="detail-item">
              <span className="label">评价ID：</span>
              <span className="value">{reviewDetail.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">用户：</span>
              <span className="value">{reviewDetail.username}</span>
            </div>
            <div className="detail-item">
              <span className="label">商家：</span>
              <span className="value">{reviewDetail.shopName}</span>
            </div>
            <div className="detail-item">
              <span className="label">菜品：</span>
              <span className="value">{reviewDetail.foodName}</span>
            </div>
            <div className="detail-item">
              <span className="label">评分：</span>
              <span className="value">{reviewDetail.rating}分</span>
            </div>
            <div className="detail-item">
              <span className="label">评价内容：</span>
              <span className="value">{reviewDetail.content || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="label">审核状态：</span>
              <span className="value">{reviewDetail.auditStatus}</span>
            </div>
            {reviewDetail.auditReason && (
              <div className="detail-item">
                <span className="label">审核原因：</span>
                <span className="value">{reviewDetail.auditReason}</span>
              </div>
            )}
            {reviewDetail.auditorName && (
              <div className="detail-item">
                <span className="label">审核人：</span>
                <span className="value">{reviewDetail.auditorName}</span>
              </div>
            )}
            {reviewDetail.auditTime && (
              <div className="detail-item">
                <span className="label">审核时间：</span>
                <span className="value">{new Date(reviewDetail.auditTime).toLocaleString('zh-CN')}</span>
              </div>
            )}
            {reviewDetail.imageUrls && reviewDetail.imageUrls.length > 0 && (
              <div className="detail-item">
                <span className="label">评价图片：</span>
                <div className="value">
                  {reviewDetail.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`评价图片${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 8, marginBottom: 8 }} />
                  ))}
                </div>
              </div>
            )}
            <div className="detail-item">
              <span className="label">创建时间：</span>
              <span className="value">{new Date(reviewDetail.createTime).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* 活动详情弹窗 */}
      <Modal
        title="活动详情"
        open={activityDetailVisible}
        onCancel={() => setActivityDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setActivityDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {activityDetail && (
          <div className="detail-content">
            <div className="detail-item">
              <span className="label">活动ID：</span>
              <span className="value">{activityDetail.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">商家名称：</span>
              <span className="value">{activityDetail.merchantName}</span>
            </div>
            <div className="detail-item">
              <span className="label">活动标题：</span>
              <span className="value">{activityDetail.title}</span>
            </div>
            <div className="detail-item">
              <span className="label">活动内容：</span>
              <span className="value">{activityDetail.content}</span>
            </div>
            <div className="detail-item">
              <span className="label">开始时间：</span>
              <span className="value">{new Date(activityDetail.startTime).toLocaleString('zh-CN')}</span>
            </div>
            <div className="detail-item">
              <span className="label">结束时间：</span>
              <span className="value">{new Date(activityDetail.endTime).toLocaleString('zh-CN')}</span>
            </div>
            <div className="detail-item">
              <span className="label">审核状态：</span>
              <span className="value">{activityDetail.auditStatus}</span>
            </div>
            {activityDetail.auditReason && (
              <div className="detail-item">
                <span className="label">审核原因：</span>
                <span className="value">{activityDetail.auditReason}</span>
              </div>
            )}
            {activityDetail.auditorName && (
              <div className="detail-item">
                <span className="label">审核人：</span>
                <span className="value">{activityDetail.auditorName}</span>
              </div>
            )}
            {activityDetail.auditTime && (
              <div className="detail-item">
                <span className="label">审核时间：</span>
                <span className="value">{new Date(activityDetail.auditTime).toLocaleString('zh-CN')}</span>
              </div>
            )}
            {activityDetail.imageUrls && activityDetail.imageUrls.length > 0 && (
              <div className="detail-item">
                <span className="label">活动图片：</span>
                <div className="value">
                  {activityDetail.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`活动图片${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 8, marginBottom: 8 }} />
                  ))}
                </div>
              </div>
            )}
            <div className="detail-item">
              <span className="label">创建时间：</span>
              <span className="value">{new Date(activityDetail.createTime).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Dashboard
