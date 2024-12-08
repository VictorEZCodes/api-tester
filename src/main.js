import './style.css'
import { RequestForm } from './components/RequestForm'
import { ResponseViewer } from './components/ResponseViewer'
import { SavedRequests } from './components/SavedRequests'

document.addEventListener('DOMContentLoaded', () => {
  new RequestForm()
  new ResponseViewer()
  new SavedRequests()
})