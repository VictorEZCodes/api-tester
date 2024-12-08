export class ResponseViewer {
  constructor() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const responseSection = document.getElementById('response-section')
    responseSection.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Response</h2>
      <div id="response-content" class="space-y-4">
        <div class="flex items-center gap-4">
          <span id="status-badge" class="px-3 py-1 rounded-full text-sm font-medium"></span>
          <span id="response-time" class="text-sm text-gray-500"></span>
        </div>
        <div>
          <h3 class="font-medium mb-2">Response Headers</h3>
          <pre id="response-headers" class="bg-gray-100 p-3 rounded-md overflow-x-auto font-['Fira_Code'] text-sm"></pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">Response Body</h3>
          <pre id="response-body" class="bg-gray-100 p-3 rounded-md overflow-x-auto font-['Fira_Code'] text-sm"></pre>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    window.addEventListener('api-response', this.handleResponse.bind(this))
    window.addEventListener('api-error', this.handleError.bind(this))
  }

  handleResponse(event) {
    const response = event.detail
    const statusBadge = document.getElementById('status-badge')
    const responseTime = document.getElementById('response-time')
    const headersElement = document.getElementById('response-headers')
    const bodyElement = document.getElementById('response-body')

    statusBadge.textContent = `${response.status} ${response.statusText}`
    statusBadge.className = `px-3 py-1 rounded-full text-sm font-medium ${response.status < 400 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`

    responseTime.textContent = `${response.time}ms`
    headersElement.textContent = JSON.stringify(response.headers, null, 2)
    bodyElement.textContent = JSON.stringify(response.data, null, 2)
  }

  handleError(event) {
    const error = event.detail
    const statusBadge = document.getElementById('status-badge')
    const bodyElement = document.getElementById('response-body')

    statusBadge.textContent = 'Error'
    statusBadge.className = 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'
    bodyElement.textContent = JSON.stringify(error, null, 2)
  }
}