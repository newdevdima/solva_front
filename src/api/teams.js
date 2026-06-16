import client from './client'

export const teamsApi = {
  list: (params) => client.get('/teams', { params }).then((r) => r.data),
  get: (id) => client.get(`/teams/${id}`).then((r) => r.data),
  create: (payload) => client.post('/teams', payload).then((r) => r.data),
  update: (id, payload) => client.put(`/teams/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/teams/${id}`),
  statistics: (id) => client.get(`/teams/${id}/statistics`).then((r) => r.data),

  members: {
    list: (teamId, params) =>
      client.get(`/teams/${teamId}/members`, { params }).then((r) => r.data),
    add: (teamId, userId) =>
      client.post(`/teams/${teamId}/members`, { user_id: userId }).then((r) => r.data),
    remove: (teamId, userId) => client.delete(`/teams/${teamId}/members/${userId}`),
  },
}
