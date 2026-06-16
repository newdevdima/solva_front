import client from './client'

export const dashboardApi = {
  kpis: (params) => client.get('/dashboard/kpis', { params }).then((r) => r.data),
  statistics: (params) => client.get('/dashboard/statistics', { params }).then((r) => r.data),
  aggregations: (params) => client.get('/dashboard/aggregations', { params }).then((r) => r.data),
  charts: (params) => client.get('/dashboard/charts', { params }).then((r) => r.data),
}
