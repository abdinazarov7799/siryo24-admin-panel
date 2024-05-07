import React, {useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {Button, Input, Modal, Pagination, Popconfirm, Popover, Row, Space, Table, Typography} from "antd";
import Container from "../../../components/Container.jsx";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import CreateEditProduct from "../components/CreateEditProduct.jsx";
const { Link,Text } = Typography;

const ProductsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [itemData, setItemData] = useState(null);
    const [searchKey,setSearchKey] = useState();
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
            title: t("name"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("category"),
            dataIndex: "category",
            key: "category",
        },
        {
            title: t("country"),
            dataIndex: "country",
            key: "country",
        },
        {
            title: t("manufacturer"),
            dataIndex: "manufacturer",
            key: "manufacturer",
        },
        {
            title: t("price"),
            key: 'price',
            dataIndex: "price",
        },
        {
            title: t("status"),
            key: 'status',
            dataIndex: "status",
            render: (text) => t(text)
        },
        {
            title: t("priceUpdatedTime"),
            key: 'priceUpdatedTime',
            dataIndex: 'priceUpdatedTime',
        },
        {
            title: t("Image"),
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 50,
            render: (props, data, index) => (
                <Link href={get(data,'imageUrl')} target="_blank">{t("Image")}</Link>
            )
        },
        {
            title: t("alternativeNames"),
            dataIndex: "alternativeNames",
            key: "alternativeNames",
            render: (props, data, index) => {
                return (
                    <Popover
                        content={
                            <Space direction={"vertical"}>{props?.map((item) => (<Text>{get(item, 'name')}</Text>))}</Space>
                        }
                        title={t("alternativeNames")}
                    >
                        <Button type="primary" icon={<EyeOutlined />} />
                    </Popover>
                )
            }
        },
        {
            title: t("analogs"),
            dataIndex: "analogs",
            key: "analogs",
            render: (props, data, index) => {
                return (
                    <Popover
                        content={
                        <Space direction={"vertical"}>{props?.map((item) => (<Text>{get(item, 'name')}</Text>))}</Space>
                    }
                        title={t("analogs")}
                    >
                        <Button type="primary" icon={<EyeOutlined />} />
                    </Popover>
                )
            }
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setItemData(data)
                    }} />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
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
                  <Button
                      icon={<PlusOutlined />}
                      type={"primary"}
                      onClick={() => setIsCreateModalOpen(true)}
                  >
                      {t("New")}
                  </Button>
                  <Modal
                      title={t('Create new product')}
                      open={isCreateModalOpenCreate}
                      onCancel={() => setIsCreateModalOpen(false)}
                      footer={null}
                  >
                      <CreateEditProduct setIsModalOpen={setIsCreateModalOpen} refetch={refetch}/>
                  </Modal>
              </Space>

              <Table
                  columns={columns}
                  dataSource={get(data,'data.data.content',[])}
                  bordered
                  size={"middle"}
                  pagination={false}
                  loading={isLoading}
                  scroll={{ x: true }}
              />

              <Modal
                  title={t("Edit product")}
                  open={isEditModalOpen}
                  onCancel={() => setIsEditModalOpen(false)}
                  footer={null}
              >
                  <CreateEditProduct
                      itemData={itemData}
                      setIsModalOpen={setIsEditModalOpen}
                      refetch={refetch}
                  />
              </Modal>

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
export default ProductsContainer
