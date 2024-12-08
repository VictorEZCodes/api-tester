import { sendRequest } from '../utils/apiHandler'
import { StorageManager } from '../utils/storage'

export class RequestForm {
  constructor() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const requestSection = document.getElementById('request-section')
    requestSection.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Request</h2>
      <form id="api-form" class="space-y-4">
        <div class="flex gap-4">
          <select id="method" class="input w-32">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input type="url" id="url" class="input flex-1" placeholder="Enter API URL" required>
        </div>
        
        <div>
          <h3 class="font-medium mb-2">Headers</h3>
          <div id="headers-container" class="space-y-2">
            <div class="flex gap-2">
              <input type="text" class="input" placeholder="Key">
              <input type="text" class="input" placeholder="Value">
              <button type="button" class="btn btn-secondary" id="add-header">+</button>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-medium mb-2">Request Body</h3>
          <textarea id="request-body" class="input font-['Fira_Code']" rows="5"></textarea>
        </div>

        <div class="flex gap-4">
          <button type="submit" class="btn btn-primary">Send Request</button>
          <button type="button" id="save-request" class="btn btn-secondary">Save Request</button>
        </div>
      </form>
    `
  }

  attachEventListeners() {
    const form = document.getElementById('api-form')
    const addHeaderBtn = document.getElementById('add-header')
    const saveBtn = document.getElementById('save-request')

    form.addEventListener('submit', this.handleSubmit.bind(this))
    addHeaderBtn.addEventListener('click', this.addHeaderField.bind(this))
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault()
      this.saveRequest()
    })
  }

  addHeaderField() {
    const container = document.getElementById('headers-container')
    const headerRow = document.createElement('div')
    headerRow.className = 'flex gap-2'
    headerRow.innerHTML = `
      <input type="text" class="input" placeholder="Key">
      <input type="text" class="input" placeholder="Value">
      <button type="button" class="btn btn-secondary" onclick="this.parentElement.remove()">-</button>
    `
    container.appendChild(headerRow)
  }

  getHeaders() {
    const headers = {}
    const headerRows = document.querySelectorAll('#headers-container > div')
    headerRows.forEach(row => {
      const [keyInput, valueInput] = row.querySelectorAll('input')
      if (keyInput.value && valueInput.value) {
        headers[keyInput.value] = valueInput.value
      }
    })
    return headers
  }

  async handleSubmit(e) {
    e.preventDefault()

    const method = document.getElementById('method').value
    const url = document.getElementById('url').value
    const headers = this.getHeaders()
    const bodyInput = document.getElementById('request-body').value

    try {
      // Parsing body as JSON if present
      let body = null;
      if (bodyInput) {
        try {
          body = JSON.parse(bodyInput);
        } catch (e) {
          body = bodyInput;
        }
      }

      const response = await sendRequest(method, url, headers, body)
      window.dispatchEvent(new CustomEvent('api-response', { detail: response }))
    } catch (error) {
      window.dispatchEvent(new CustomEvent('api-error', { detail: error }))
    }
  }

  saveRequest() {
    const request = {
      method: document.getElementById('method').value,
      url: document.getElementById('url').value,
      headers: this.getHeaders(),
      body: document.getElementById('request-body').value
    }

    const savedRequest = StorageManager.saveRequest(request)
    window.dispatchEvent(new CustomEvent('request-saved', { detail: savedRequest }))
  }
}