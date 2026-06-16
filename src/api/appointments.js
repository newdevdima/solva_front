import client from './client'

export const appointmentsApi = {
  list: (params) => client.get('/appointments', { params }).then((r) => r.data),
  statistics: (params) => client.get('/appointments/statistics', { params }).then((r) => r.data),
  get: (id) => client.get(`/appointments/${id}`).then((r) => r.data),
  create: (payload) => client.post('/appointments', payload).then((r) => r.data),
  update: (id, payload) => client.put(`/appointments/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/appointments/${id}`),
  reschedule: (id, scheduledAt) =>
    client.patch(`/appointments/${id}/reschedule`, { scheduled_at: scheduledAt }).then((r) => r.data),
  updateStatus: (id, status) =>
    client.patch(`/appointments/${id}/status`, { status }).then((r) => r.data),

  reminders: {
    list: (appointmentId, params) =>
      client.get(`/appointments/${appointmentId}/reminders`, { params }).then((r) => r.data),
    create: (appointmentId, payload) =>
      client.post(`/appointments/${appointmentId}/reminders`, payload).then((r) => r.data),
    update: (appointmentId, reminderId, payload) =>
      client
        .put(`/appointments/${appointmentId}/reminders/${reminderId}`, payload)
        .then((r) => r.data),
    remove: (appointmentId, reminderId) =>
      client.delete(`/appointments/${appointmentId}/reminders/${reminderId}`),
    markSent: (appointmentId, reminderId) =>
      client
        .patch(`/appointments/${appointmentId}/reminders/${reminderId}/sent`)
        .then((r) => r.data),
  },
}
