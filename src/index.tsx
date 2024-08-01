import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/app';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Main,NotFound, Loading } from '@/pages';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router=createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children:[
      {
        path: '/',
        element: <Main />,
        errorElement: <NotFound />
      }
    ]
  }
])


root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Loading />}/>
  </React.StrictMode>
);
