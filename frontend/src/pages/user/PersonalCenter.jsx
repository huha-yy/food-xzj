import { useState, useEffect } from 'react'
import {
  Card,
  Avatar,
  Form,
  Input,
  Button,
  message,
  Tabs,
  Tag,
  Descriptions,
  Modal,
  Upload,
  Rate,
  Empty,
  Spin,
  Popconfirm,
  Image
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  HeartOutlined,
  StarOutlined,
  UploadOutlined,
  CheckCircleFilled,
  LikeOutlined,
  DeleteOutlined,
  ShopOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, updateUserInfo, updatePassword } from '@/api/user'
import { uploadImage } from '@/api/upload'
import { getMyReviews, deleteReview, updateReview } from '@/api/review'
import './PersonalCenter.css'

// 装饰图标
const decorationIcons = ['🍜', '🍕', '🍔', '🍰']

function PersonalCenter() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [editForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)

  // 我的评价
  const [myReviews, setMyReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsTotal, setReviewsTotal] = useState(0)
  const [reviewsPage, setReviewsPage] = useState(1)
  const [editReviewVisible, setEditReviewVisible] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [editReviewForm] = Form.useForm()

  useEffect(() => {
    fetchUserInfo()
  }, [])

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchMyReviews(1)
    }
  }, [activeTab])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const data = await getCurrentUser()
      setUserInfo(data)
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      localStorage.setItem('userInfo', JSON.stringify({
        ...storedUserInfo,
        ...data
      }))
    } catch (error) {
      console.error('获取用户信息失败:', error)
      message.error('获取用户信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEditInfo = async (values) => {
    try {
      await updateUserInfo(values)
      message.success('修改成功')
      setEditModalVisible(false)
      editForm.resetFields()

      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      localStorage.setItem('userInfo', JSON.stringify({
        ...storedUserInfo,
        ...values
      }))
      setAvatarUrl(values.avatar || '')
      setUserInfo(prev => ({ ...prev, ...values }))

      setTimeout(() => {
        fetchUserInfo()
      }, 100)
    } catch (error) {
      console.error('修改用户信息失败:', error)
      message.error('修改失败')
    }
  }

  const handleChangePassword = async (values) => {
    try {
      await updatePassword(values.oldPassword, values.newPassword)
      message.success('密码修改成功，请重新登录')
      setPasswordModalVisible(false)
      passwordForm.resetFields()
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      navigate('/login')
    } catch (error) {
      console.error('修改密码失败:', error)
      message.error('修改失败，请检查原密码是否正确')
    }
  }

  const openEditModal = () => {
    editForm.setFieldsValue({
      nickname: userInfo?.nickname,
      phone: userInfo?.phone,
      avatar: userInfo?.avatar,
      studentNo: userInfo?.studentNo
    })
    setAvatarUrl(userInfo?.avatar || '')
    setEditModalVisible(true)
  }

  const handleAvatarUpload = async (file) => {
    try {
      setAvatarUploading(true)
      const result = await uploadImage(file)
      setAvatarUrl(result.imageUrl)
      editForm.setFieldsValue({ avatar: result.imageUrl })
      message.success('头像上传成功')
    } catch (error) {
      console.error('头像上传失败:', error)
      message.error('头像上传失败')
    } finally {
      setAvatarUploading(false)
    }
  }

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isImage) {
      message.error('只能上传图片文件！')
      return Upload.LIST_IGNORE
    }
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！')
      return Upload.LIST_IGNORE
    }
    return true
  }

  const openPasswordModal = () => {
    passwordForm.resetFields()
    setPasswordModalVisible(true)
  }

  const fetchMyReviews = async (page = 1) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    if (!userInfo.userId) return
    try {
      setReviewsLoading(true)
      const data = await getMyReviews({ userId: userInfo.userId, current: page, pageSize: 5 })
      setMyReviews(data?.records || [])
      setReviewsTotal(data?.total || 0)
      setReviewsPage(page)
    } catch (error) {
      message.error('获取评价列表失败')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId)
      message.success('撤回成功')
      fetchMyReviews(reviewsPage)
      fetchUserInfo()
    } catch (error) {
      message.error('撤回失败')
    }
  }

  const openEditReview = (review) => {
    setEditingReview(review)
    editReviewForm.setFieldsValue({
      rating: review.rating,
      content: review.content
    })
    setEditReviewVisible(true)
  }

  const handleEditReview = async (values) => {
    try {
      await updateReview({
        reviewId: editingReview.reviewId,
        rating: values.rating,
        content: values.content
      })
      message.success('修改成功，已重新进入待审核状态')
      setEditReviewVisible(false)
      editReviewForm.resetFields()
      fetchMyReviews(reviewsPage)
    } catch (error) {
      message.error(error?.message || '修改失败')
    }
  }

  const getAuditStatusTag = (status) => {
    const map = {
      PENDING: <Tag color="orange">待审核</Tag>,
      APPROVED: <Tag color="green">已通过</Tag>,
      REJECTED: <Tag color="red">已驳回</Tag>
    }
    return map[status] || <Tag>{status}</Tag>
  }

  const getRoleText = (role) => {
    const roleMap = {
      'STUDENT': '学生',
      'MERCHANT': '商家',
      'ADMIN': '管理员'
    }
    return roleMap[role] || role
  }

  const getStatusText = (status) => {
    const statusMap = {
      'ACTIVE': '正常',
      'DISABLED': '禁用'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="personal-center">
        <Card loading={true} />
      </div>
    )
  }

  return (
    <div className="personal-center">
      {/* 用户资料头部 */}
      <div className="user-profile-header">
        {/* 装饰元素 */}
        {decorationIcons.map((icon, index) => (
          <span key={index} className="profile-decoration">
            {icon}
          </span>
        ))}

        <div className="profile-content">
          <div className="user-avatar-wrapper">
            <Avatar
              size={100}
              src={userInfo?.avatar}
              icon={<UserOutlined />}
            />
            {userInfo?.status === 'ACTIVE' && (
              <span className="avatar-badge">
                <CheckCircleFilled />
              </span>
            )}
          </div>

          <div className="user-detail">
            <h2>{userInfo?.nickname || userInfo?.username}</h2>
            <p className="username">@{userInfo?.username}</p>
            <div className="user-tags">
              <Tag className="active-tag">{getRoleText(userInfo?.role)}</Tag>
              <Tag>{userInfo?.status === 'ACTIVE' ? '账号正常' : '账号禁用'}</Tag>
              {userInfo?.studentNo && <Tag>学号: {userInfo?.studentNo}</Tag>}
            </div>
          </div>

          <div className="profile-actions">
            <Button icon={<EditOutlined />} onClick={openEditModal}>
              编辑资料
            </Button>
            <Button icon={<LockOutlined />} onClick={openPasswordModal}>
              修改密码
            </Button>
            {userInfo?.role === 'STUDENT' && (
              <Button icon={<ShopOutlined />} onClick={() => navigate('/merchant/apply')}>
                申请入驻
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="stats-section">
        <div className="stat-card" onClick={() => navigate('/collections')}>
          <div className="stat-icon collections">
            <HeartOutlined />
          </div>
          <div className="stat-value">{userInfo?.collectionsCount || 0}</div>
          <div className="stat-label">我的收藏</div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('reviews')}>
          <div className="stat-icon reviews">
            <StarOutlined />
          </div>
          <div className="stat-value">{userInfo?.reviewsCount || 0}</div>
          <div className="stat-label">我的评价</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon likes">
            <LikeOutlined />
          </div>
          <div className="stat-value">{userInfo?.likesCount || 0}</div>
          <div className="stat-label">获得点赞</div>
        </div>
      </div>

      {/* 详细信息卡片 */}
      <Card className="content-card" bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'profile',
              label: '基本信息',
              children: (
                <>
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="用户名">
                      {userInfo?.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="昵称">
                      {userInfo?.nickname || '未设置'}
                    </Descriptions.Item>
                    <Descriptions.Item label="手机号">
                      {userInfo?.phone || '未设置'}
                    </Descriptions.Item>
                    <Descriptions.Item label="角色">
                      {getRoleText(userInfo?.role)}
                    </Descriptions.Item>
                    <Descriptions.Item label="学号">
                      {userInfo?.studentNo || '未设置'}
                    </Descriptions.Item>
                    <Descriptions.Item label="账号状态">
                      <Tag color={userInfo?.status === 'ACTIVE' ? 'green' : 'red'}>
                        {getStatusText(userInfo?.status)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="注册时间">
                      {userInfo?.createTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="最后更新">
                      {userInfo?.updateTime}
                    </Descriptions.Item>
                  </Descriptions>

                  <div className="action-buttons">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={openEditModal}
                    >
                      修改个人信息
                    </Button>
                    <Button
                      icon={<LockOutlined />}
                      onClick={openPasswordModal}
                    >
                      修改密码
                    </Button>
                  </div>
                </>
              )
            },
            {
              key: 'reviews',
              label: '我的评价',
              children: (
                <Spin spinning={reviewsLoading}>
                  {myReviews.length === 0 && !reviewsLoading ? (
                    <Empty description="暂无评价记录" />
                  ) : (
                    <>
                      {myReviews.map(review => (
                        <Card
                          key={review.reviewId}
                          style={{ marginBottom: 12 }}
                          size="small"
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 500 }}>{review.foodName}</span>
                                <span style={{ color: '#999', fontSize: 12 }}>{review.shopName}</span>
                                {getAuditStatusTag(review.auditStatus)}
                              </div>
                              <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                              <p style={{ margin: '6px 0', color: '#555' }}>{review.content}</p>
                              {review.auditStatus === 'REJECTED' && review.auditReason && (
                                <p style={{ color: '#f5222d', fontSize: 12 }}>驳回原因：{review.auditReason}</p>
                              )}
                              {review.imageUrls && review.imageUrls.length > 0 && (
                                <Image.PreviewGroup>
                                  {review.imageUrls.map((url, idx) => (
                                    <Image key={idx} src={url} width={60} height={60} style={{ objectFit: 'cover', marginRight: 6, borderRadius: 4 }} />
                                  ))}
                                </Image.PreviewGroup>
                              )}
                              <div style={{ color: '#999', fontSize: 12, marginTop: 6 }}>{review.createTime}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 12 }}>
                              {review.auditStatus !== 'APPROVED' && (
                                <Button
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => openEditReview(review)}
                                >
                                  修改
                                </Button>
                              )}
                              <Popconfirm
                                title="确定要撤回该评价吗？"
                                onConfirm={() => handleDeleteReview(review.reviewId)}
                                okText="确定"
                                cancelText="取消"
                              >
                                <Button size="small" danger icon={<DeleteOutlined />}>
                                  撤回
                                </Button>
                              </Popconfirm>
                            </div>
                          </div>
                        </Card>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ color: '#999', fontSize: 13 }}>共 {reviewsTotal} 条评价</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button size="small" disabled={reviewsPage <= 1} onClick={() => fetchMyReviews(reviewsPage - 1)}>上一页</Button>
                          <span style={{ lineHeight: '24px', fontSize: 13 }}>第 {reviewsPage} 页</span>
                          <Button size="small" disabled={reviewsPage * 5 >= reviewsTotal} onClick={() => fetchMyReviews(reviewsPage + 1)}>下一页</Button>
                        </div>
                      </div>
                    </>
                  )}
                </Spin>
              )
            }
          ]}
        />
      </Card>

      {/* 修改个人信息弹窗 */}
      <Modal
        title="修改个人信息"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          editForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditInfo}
          autoComplete="off"
        >
          <Form.Item label="头像">
            <div className="avatar-upload-section">
              <Avatar
                size={80}
                src={avatarUrl}
                icon={<UserOutlined />}
              />
              <Upload
                name="file"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={({ file }) => handleAvatarUpload(file)}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={avatarUploading}
                >
                  {avatarUploading ? '上传中...' : '上传头像'}
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item name="avatar" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ max: 32, message: '昵称长度不能超过32位' }]}
          >
            <Input placeholder="请输入昵称" maxLength={32} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="studentNo"
            label="学号"
            rules={[{ max: 16, message: '学号长度不能超过16位' }]}
          >
            <Input placeholder="请输入学号（仅学生需要填写）" maxLength={16} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setEditModalVisible(false)
                editForm.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改评价弹窗 */}
      <Modal
        title="修改评价"
        open={editReviewVisible}
        onCancel={() => { setEditReviewVisible(false); editReviewForm.resetFields() }}
        footer={null}
      >
        <Form form={editReviewForm} layout="vertical" onFinish={handleEditReview}>
          <Form.Item name="rating" label="评分" rules={[{ required: true, message: '请选择评分' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="content" label="评价内容" rules={[{ required: true, message: '请输入评价内容' }, { max: 500, message: '评价内容不能超过500字' }]}>
            <Input.TextArea rows={4} placeholder="请输入评价内容" maxLength={500} showCount />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <Button onClick={() => { setEditReviewVisible(false); editReviewForm.resetFields() }}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false)
          passwordForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, max: 20, message: '密码长度6-20位' },
              { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码必须包含字母和数字' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" maxLength={20} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次密码输入不一致'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" maxLength={20} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setPasswordModalVisible(false)
                passwordForm.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PersonalCenter
