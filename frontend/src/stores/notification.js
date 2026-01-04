import { defineStore } from 'pinia'
import { notificationService } from '@/services'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false
  }),

  actions: {
    async fetchNotifications() {
      try {
        this.loading = true
        const response = await notificationService.getMyNotifications()
        this.notifications = response.data || []
        this.unreadCount = response.unreadCount || 0
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        this.loading = false
      }
    },

    async markAsRead(id) {
      try {
        await notificationService.markAsRead(id)
        const notification = this.notifications.find(n => n._id === id)
        if (notification) {
          notification.isRead = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    },

    async markAllAsRead() {
      try {
        await notificationService.markAllAsRead()
        this.notifications.forEach(n => n.isRead = true)
        this.unreadCount = 0
      } catch (error) {
        console.error('Error marking all as read:', error)
      }
    },

    async deleteNotification(id) {
      try {
        await notificationService.deleteNotification(id)
        this.notifications = this.notifications.filter(n => n._id !== id)
        const wasUnread = this.notifications.find(n => n._id === id && !n.isRead)
        if (wasUnread) {
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        console.error('Error deleting notification:', error)
      }
    }
  }
})
