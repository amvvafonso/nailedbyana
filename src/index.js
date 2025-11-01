import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./App.css"
import FullscreenLoading from './components/Loading';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <React.Suspense fallback={<FullscreenLoading/>}>
        <App />
      </React.Suspense>
);
