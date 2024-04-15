import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get, isEqual} from "lodash";
import {Button, Modal, Row, Space, Table} from "antd";
import {useTranslation} from "react-i18next";
import {EditOutlined} from "@ant-design/icons";

const LogsContainer = () => {
    const {t} = useTranslation();
    let constants = []
    const {data,isLoading,refetch} = useGetAllQuery({
        key: KEYS.constants_get_all,
        url: URLS.constants_get_all,
    })
    const columns = [
        {
            title: t("Key"),
            dataIndex: "key",
            key: "key",
        },
        {
            title: t("Value"),
            dataIndex: "value",
            key: "value",
        }
    ]
    for (const [key, value] of Object.entries(get(data,'data.data',{}))) {
        !isEqual(key, 'id') && constants.push({key, value})
    }
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    columns={columns}
                    dataSource={constants}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />
            </Space>
        </Container>
    );
};

export default LogsContainer;
