import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './router/MainRouter.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.redux.ts'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      
      <ToastContainer
      limit = {1}
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false} 
      />
      <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
