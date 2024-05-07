import React, {useState} from "react";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {Button, Input, Modal, Pagination, Popconfirm, Popover, Row, Space, Switch, Table, Typography} from "antd";
import Container from "../../../components/Container.jsx";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import CreateEditSeller from "../components/CreateEditSeller.jsx";
const {Text} = Typography;

const SellersContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [itemData, setItemData] = useState(null);
    const [searchKey,setSearchKey] = useState();
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.seller_get_all,
        url: URLS.seller_get_all,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });
    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.seller_get_all
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.seller_delete}/${id}`},{
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
            title: t("organization"),
            dataIndex: "organization",
            key: "organization",
        },
        {
            title: t("channel"),
            dataIndex: "channel",
            key: "channel",
        },
        {
            title: t("chatId"),
            dataIndex: "chatId",
            key: "chatId",
        },
        {
            title: t("phoneNumber1"),
            dataIndex: "phoneNumber1",
            key: "phoneNumber1",
        },
        {
            title: t("phoneNumber2"),
            dataIndex: "phoneNumber2",
            key: "phoneNumber2",
        },
        {
            title: t("info"),
            dataIndex: "info",
            key: "info",
        },
        {
            title: t("stockMarket"),
            dataIndex: "stockMarket",
            key: "stockMarket",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'stockMarket')} />
            )
        },
        {
            title: t("Products"),
            dataIndex: "products",
            key: "products",
            render: (props, data, index) => {
                return (
                    <Popover
                        content={
                            <Space direction={"vertical"}>{props?.map((item) => (<Text>{get(item, 'name')}</Text>))}</Space>
                        }
                        title={t("the products they sell")}
                    >
                        <Button type="primary" icon={<EyeOutlined />} />
                    </Popover>
                )
            }
        },
        {
            title: t("acceptTransfer"),
            dataIndex: "acceptTransfer",
            key: "acceptTransfer",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'acceptTransfer')} />
            )
        },
        {
            title: t("acceptCash"),
            dataIndex: "acceptCash",
            key: "acceptCash",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'acceptCash')} />
            )
        },
        {
            title: t("is active"),
            dataIndex: "active",
            key: "active",
            render: (props,data,index) => (
                <Switch disabled checked={get(data,'active')} />
            )
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
                      title={t('Create new seller')}
                      open={isCreateModalOpenCreate}
                      onCancel={() => setIsCreateModalOpen(false)}
                      footer={null}
                  >
                      <CreateEditSeller setIsModalOpen={setIsCreateModalOpen} refetch={refetch}/>
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
                  title={t("Edit seller")}
                  open={isEditModalOpen}
                  onCancel={() => setIsEditModalOpen(false)}
                  footer={null}
              >
                  <CreateEditSeller
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
export default SellersContainer
