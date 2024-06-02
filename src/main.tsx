import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout.tsx";
import AuthProvider from "./hooks/AuthContext.tsx";
import router from "./router.tsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./api.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BaseLayout>
          <RouterProvider router={router}/>
        </BaseLayout>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
)
