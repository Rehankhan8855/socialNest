import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from './components/ui/provider.jsx'
import './index.css'
import App from './App.jsx'
import { ColorModeProvider } from './components/ui/color-mode.jsx';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ColorModeProvider forcedTheme="light">
    {/* <BrowserRouter> */}
     <ReduxProvider store={store}>
      <Provider>
      <App/>
      </Provider>
      {/* <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/feed" element={<FeedPage/>}/>
      </Routes> */}
    </ReduxProvider>
    {/* </BrowserRouter> */}
    </ColorModeProvider>
  </StrictMode>,
)
