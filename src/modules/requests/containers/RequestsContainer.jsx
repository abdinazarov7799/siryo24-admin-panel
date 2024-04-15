import React, {useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import { Input, Pagination, Row, Space, Switch, Table} from "antd";
import Container from "../../../components/Container.jsx";
const RequestsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [itemData, setItemData] = useState(null);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.product_get_all,
        url: URLS.product_get_all,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });
    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.product_get_all
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.product_delete}/${id}`},{
            onSuccess: () => {
                refetch();
            }
        })
    }
    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
            width: 30
        },
        {
            title: t("nameUz"),
            dataIndex: "nameUz",
            key: "nameUz",
        },
        {
            title: t("nameRu"),
            dataIndex: "nameRu",
            key: "nameRu",
        },
        {
            title: t("descriptionUz"),
            dataIndex: "descriptionUz",
            key: "descriptionUz",
        },
        {
            title: t("descriptionRu"),
            dataIndex: "descriptionRu",
            key: "descriptionRu",
        },
        {
            title: t("Category name uz"),
            key: 'categoryNameUz',
            render: (props, data, index) => {
                return get(data,'categories.nameUz')
            }
        },
        {
            title: t("Category name ru"),
            key: 'categoryNameRu',
            render: (props, data, index) => {
                return get(data,'categories.nameRu')
            }
        },
        {
            title: t("Order"),
            dataIndex: "number",
            key: "number",
            width: 70
        },
        {
            title: t("is active"),
            dataIndex: "active",
            key: "active",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'active')} />
            )
        },
    ]

    return(
      <Container>
          <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
              <Space size={"middle"}>
                  <Input.Search
                      placeholder={t("Search")}
                      onChange={(e) => setSearchKey(e.target.value)}
                      allowClear
                  />
              </Space>

              <Table
                  columns={columns}
                  dataSource={get(data,'data.data.content',[])}
                  bordered
                  size={"middle"}
                  pagination={false}
                  loading={isLoading}
              />

              <Row justify={"end"} style={{marginTop: 10}}>
                  <Pagination
                      current={page+1}
                      onChange={(page) => setPage(page - 1)}
                      total={get(data,'data.data.totalPages') * 10 }
                      showSizeChanger={false}
                  />
              </Row>
          </Space>
      </Container>
  )
}
export default RequestsContainer
