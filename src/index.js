import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./App.css"
import FullscreenLoading from './components/Loading';
import { ProductsProvider } from './services/ProductProvider';



const root = createRoot(document.getElementById('root'));
root.render(
      <React.Suspense fallback={<FullscreenLoading/>}>
        <ProductsProvider>
          <App />
          </ProductsProvider>
      </React.Suspense>
);
