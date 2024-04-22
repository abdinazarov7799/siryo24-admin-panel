import {Layout, Menu} from "antd";
import {get} from "lodash";
import React from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
const {Sider} = Layout
const DashboardSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const items = [
        {
            label: t("Categories"),
            key: "/categories",
        },
        {
            label: t("Products"),
            key: "/products",
        },
        {
            label: t("Sellers"),
            key: "/sellers",
        },
        {
            label: t("Users"),
            key: "/users",
        },
        {
            label: t("Translations"),
            key: "/translations",
        },
    ];

  return(
      <Sider
          theme={"light"}
          style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
          }}
      >
          <Menu
              mode="inline"
              style={{padding: 5}}
              onSelect={(event) => {navigate(get(event,'key','/'))}}
              items={items}
              selectedKeys={[get(location,'pathname','')]}
          />

      </Sider>
  )
}
export default DashboardSidebar
