import { StorageManager } from '../utils/storage'

export class SavedRequests {
  constructor() {
    this.render()
    this.attachEventListeners()
    this.loadSavedRequests()
  }

  render() {
    const savedSection = document.getElementById('saved-requests')
    savedSection.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Saved Requests</h2>
      <div id="saved-requests-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      </div>
    `
  }

  attachEventListeners() {
    window.addEventListener('request-saved', () => {
      console.log('Request saved event received')
      this.loadSavedRequests()
    })

    window.addEventListener('delete-request', (e) => {
      StorageManager.deleteRequest(e.detail)
      this.loadSavedRequests()
    })

    window.addEventListener('load-request', (e) => this.loadRequest(e.detail))
  }

  loadSavedRequests() {
    const requests = StorageManager.getSavedRequests()
    const container = document.getElementById('saved-requests-list')

    if (requests.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No saved requests yet.</p>'
      return
    }

    container.innerHTML = requests.map(request => `
      <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-2">
          <span class="inline-block px-2 py-1 text-sm font-medium bg-gray-100 rounded">
            ${request.method}
          </span>
          <button 
            onclick="window.dispatchEvent(new CustomEvent('delete-request', {detail: '${request.id}'}))"
            class="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
        <div class="text-sm truncate mb-2" title="${request.url}">${request.url}</div>
        <div class="text-xs text-gray-500 mb-2">
          ${new Date(request.timestamp).toLocaleString()}
        </div>
        <button 
          onclick='window.dispatchEvent(new CustomEvent("load-request", {detail: ${JSON.stringify(request)}}))'
          class="text-sm text-blue-500 hover:text-blue-700"
        >
          Load Request
        </button>
      </div>
    `).join('')
  }

  loadRequest(request) {
    document.getElementById('method').value = request.method
    document.getElementById('url').value = request.url
    document.getElementById('request-body').value = request.body || ''

    const headerContainer = document.getElementById('headers-container')
    headerContainer.innerHTML = ''

    if (request.headers && Object.keys(request.headers).length > 0) {
      Object.entries(request.headers).forEach(([key, value]) => {
        const headerRow = document.createElement('div')
        headerRow.className = 'flex gap-2'
        headerRow.innerHTML = `
          <input type="text" class="input" placeholder="Key" value="${key}">
          <input type="text" class="input" placeholder="Value" value="${value}">
          <button type="button" class="btn btn-secondary" onclick="this.parentElement.remove()">-</button>
        `
        headerContainer.appendChild(headerRow)
      })
    } else {
      // Add an empty header row if no headers
      const headerRow = document.createElement('div')
      headerRow.className = 'flex gap-2'
      headerRow.innerHTML = `
        <input type="text" class="input" placeholder="Key">
        <input type="text" class="input" placeholder="Value">
        <button type="button" class="btn btn-secondary" onclick="this.parentElement.remove()">-</button>
      `
      headerContainer.appendChild(headerRow)
    }
  }
}