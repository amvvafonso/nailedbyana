import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./App.css"
import FullscreenLoading from './components/Loading';
import { ProductsProvider } from './services/ProductProvider';
import { Cart } from './services/Cart';




const root = createRoot(document.getElementById('root'));
root.render(
      <React.Suspense fallback={<FullscreenLoading/>}>
        <ProductsProvider>
            <Cart>
              <App />
            </Cart>
          </ProductsProvider>
      </React.Suspense>
);
