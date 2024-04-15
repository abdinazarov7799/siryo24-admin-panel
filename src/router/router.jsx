import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// LAYOUTS
import DashboardLayout from "../layouts/dashboard/DashboardLayout.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
// LAYOUTS

// AUTH
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import LoginPage from "../modules/auth/pages/LoginPage";
// AUTH

// 404
import NotFoundPage from  "../modules/auth/pages/NotFoundPage";
// 404

// PAGES
import CategoryPage from "../modules/categories/pages/CategoryPage.jsx";
import TranslationPage from "../modules/translation/pages/TranslationPage.jsx";
import OverlayLoader from "../components/OverlayLoader.jsx";
import ProductsPage from "../modules/products/pages/ProductsPage.jsx";
import ConstantsPage from "../modules/constants/pages/ConstantsPage.jsx";
import UsersPage from "../modules/users/pages/UsersPage.jsx";
import LogsPage from "../modules/logs/pages/LogsPage.jsx";
import RequestsPage from "../modules/requests/pages/RequestsPage.jsx";
import SellersPage from "../modules/sellers/pages/SellersPage.jsx";
import SubCategoryPage from "../modules/sub-categories/pages/SubCategoryPage.jsx";
// PAGES


const Router = ({ ...rest }) => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route
                  path={"/categories"}
                  element={<CategoryPage />}
              />
              <Route
                  path={"/sub-categories"}
                  element={<SubCategoryPage />}
              />
              <Route
                  path={"/products"}
                  element={<ProductsPage />}
              />
              <Route
                  path={"/sellers"}
                  element={<SellersPage />}
              />
              <Route
                  path={"/constants"}
                  element={<ConstantsPage />}
              />
              <Route
                  path={"/requests"}
                  element={<RequestsPage />}
              />
              <Route
                  path={"/users"}
                  element={<UsersPage />}
              />
              <Route
                  path={"/translations"}
                  element={<TranslationPage />}
              />
              <Route
                  path={"/logs"}
                  element={<LogsPage />}
              />
              <Route
                  path={"auth/*"}
                  element={<Navigate to={"/categories"} replace />}
              />
              <Route
                  path={"/"}
                  element={<Navigate to={"/categories"} replace />}
              />
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
