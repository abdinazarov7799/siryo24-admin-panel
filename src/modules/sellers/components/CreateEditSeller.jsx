import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, Select, Space} from "antd";
const { TextArea } = Input;
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";

const CreateEditSeller = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [acceptCash, setAcceptCash] = useState(get(itemData,'acceptCash',true));
    const [acceptTransfer, setAcceptTransfer] = useState(get(itemData,'acceptTransfer',true));
    const [stockMarket, setStockMarket] = useState(get(itemData,'stockMarket',true));
    const [searchProduct,setSearchProduct] = useState(null);
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.seller_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.seller_get_all,
        hideSuccessToast: false
    });
    const { data:products,isLoading:isLoadingProducts } = useGetAllQuery({
        key: KEYS.product_get_all,
        url: URLS.product_get_all,
        params: {
            params: {
                search: searchProduct,
                size: 1000
            }
        }
    })

    useEffect(() => {
        form.setFieldsValue({
            organization: get(itemData,'organization'),
            channel: get(itemData,'channel'),
            phoneNumber1: get(itemData,'phoneNumber1'),
            phoneNumber2: get(itemData,'phoneNumber2'),
            info: get(itemData,'info')
        });
        setIsActive(get(itemData,'active',true))
        setAcceptCash(get(itemData,'acceptCash',true))
        setAcceptTransfer(get(itemData,'acceptTransfer',true))
        setStockMarket(get(itemData,'stockMarket',true))
    }, [itemData]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            acceptCash,
            acceptTransfer,
            stockMarket
        }
        if (itemData){
            mutateEdit(
                { url: `${URLS.seller_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.seller_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
    };
    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("organization")}
                    name="organization"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("channel")}
                    name="channel"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("chatId")}
                    name="chatId"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("info")}
                    name="info"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("phoneNumber1")}
                    name="phoneNumber1"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("phoneNumber2")}
                    name="phoneNumber2"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Products")}
                    name="products"
                >
                    <Select
                        showSearch
                        mode={"multiple"}
                        placeholder={t("Products")}
                        optionFilterProp="children"
                        onSearch={(e) => setSearchProduct(e)}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingProducts}
                        options={get(products,'data.data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'name')
                            }
                        })}
                    />
                </Form.Item>

                <Space size={"middle"}>
                    <div>
                        <Form.Item
                            name="active"
                            valuePropName="active"
                        >
                            <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")} ?</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name="acceptCash"
                            valuePropName="acceptCash"
                        >
                            <Checkbox checked={acceptCash} onChange={(e) => setAcceptCash(e.target.checked)}>{t("acceptCash")} ?</Checkbox>
                        </Form.Item>
                    </div>

                    <div>
                        <Form.Item
                            name="acceptTransfer"
                            valuePropName="acceptTransfer"
                        >
                            <Checkbox checked={acceptTransfer} onChange={(e) => setAcceptTransfer(e.target.checked)}>{t("acceptTransfer")} ?</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name="stockMarket"
                            valuePropName="stockMarket"
                        >
                            <Checkbox checked={stockMarket} onChange={(e) => setStockMarket(e.target.checked)}>{t("stockMarket")} ?</Checkbox>
                        </Form.Item>
                    </div>
                </Space>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditSeller;
