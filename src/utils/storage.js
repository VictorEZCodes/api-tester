export class StorageManager {
  static STORAGE_KEY = 'api_tester_saved_requests'

  static saveRequest(request) {
    const saved = this.getSavedRequests()
    const timestamp = new Date().toISOString()
    const newRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp
    }

    saved.unshift(newRequest)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved))
    console.log('Request saved:', newRequest)
    return newRequest
  }

  static getSavedRequests() {
    const saved = localStorage.getItem(this.STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  }

  static deleteRequest(id) {
    const saved = this.getSavedRequests()
    const filtered = saved.filter(req => req.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }
}