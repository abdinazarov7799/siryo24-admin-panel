import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Input, Modal, Pagination, Row, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";

const PriceHistoryContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [selected, setSelected] = useState(false);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.get_price_history,
        url: URLS.get_price_history,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });
    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("product"),
            dataIndex: "product",
            key: "product"
        },
        {
            title: t("seller"),
            dataIndex: "seller",
            key: "seller",
        },
        {
            title: t("update id"),
            dataIndex: "updates",
            key: "updateId",
            width: 100,
            render: (data) => {
                return get(data,'id')
            }
        },
        {
            title: t("Price"),
            dataIndex: "updates",
            key: "price",
            render: (data) => {
                return get(data,'price')
            }
        },
        {
            title: t("Updated time"),
            dataIndex: "updates",
            key: "updatedTime",
            render: (data) => {
                return get(data,'updatedTime')
            }
        },
    ]
    return (
        <Container>
            <Modal
                title={t("Updates history")}
                open={!!selected}
                onCancel={() => setSelected(false)}
                footer={null}
            >
                <Table
                    columns={[
                        {
                            title: t("ID"),
                            dataIndex: "id",
                            key: "id",
                        },
                        {
                            title: t("price"),
                            dataIndex: "price",
                            key: "price",
                        },
                        {
                            title: t("status"),
                            dataIndex: "status",
                            key: "status",
                        },
                        {
                            title: t("updatedTime"),
                            dataIndex: "updatedTime",
                            key: "updatedTime",
                        },

                    ]}
                    dataSource={selected}
                    bordered
                    size={"middle"}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </Modal>
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
                    scroll={{ x: true }}
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
    );
};

export default PriceHistoryContainer;
