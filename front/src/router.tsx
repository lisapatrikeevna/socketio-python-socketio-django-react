// router.tsx
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import App from './App';
import HomePage from './pages/homePage';
import PageLogin from './pages/auth/login/pageLogin';
import RegisterForm from './pages/auth/registerForm/RegisterForm';
import ErrorPage from './pages/errorPage/ErrorPage';

import { useMeQuery } from './bll/auth/auth.servies';
import { appAC } from './bll/app.slice';
import {ChatPage} from "./pages/ChatPage.tsx";
import type {UserType} from "./bll/auth/auth.type.ts";
import type {RootStateType} from "./bll/store.ts";
import {PATH} from "./paths.ts";



const publicRoutes = [
  { path: PATH.home, element: <HomePage /> },
  { path: PATH.login, element: <PageLogin /> },
  { path: PATH.register, element: <RegisterForm /> },
];

const privateRoutes = [
  { path: PATH.chat, element: <ChatPage /> },
];

function PrivateRoutes() {
  const dispatch = useDispatch();
  const user = useSelector<RootStateType, UserType | null>(state => state.app.user);
  const { data, isError, isLoading } = useMeQuery(undefined, { skip: !!user });

  useEffect(() => {
    dispatch(appAC.changeStatusIsLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (data && !user) {
      dispatch(appAC.setUser(data));
    }
  }, [data, user, dispatch]);

  if (isError || (!data && !isLoading && !user)) {
    return <Navigate to={PATH.login} />;
  }

  if (!user && isLoading) {
    return null;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      ...publicRoutes,
      {
        element: <PrivateRoutes />,
        children: privateRoutes,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;