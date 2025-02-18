import { createRoot } from 'react-dom/client'
import App from './components/App/App.tsx'
import './main.scss'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
