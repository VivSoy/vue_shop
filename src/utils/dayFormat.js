// 封装时间格式处理模块
import dayjs from 'dayjs'

// 格式化时间为 YYYY-MM-DD HH:mm:ss
export const formatTime = timeStamp => {
  return dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
}
