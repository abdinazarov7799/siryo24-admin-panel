import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, Space} from "antd";
const { TextArea } = Input;
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const CreateEditSeller = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [acceptCash, setAcceptCash] = useState(get(itemData,'acceptCash',true));
    const [acceptTransfer, setAcceptTransfer] = useState(get(itemData,'acceptTransfer',true));
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.seller_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.seller_get_all,
        hideSuccessToast: false
    });

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
    }, [itemData]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            acceptCash,
            acceptTransfer
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
                    rules={[{required: true,}]}
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

                <Space size={"middle"}>
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

                    <Form.Item
                        name="acceptTransfer"
                        valuePropName="acceptTransfer"
                    >
                        <Checkbox checked={acceptTransfer} onChange={(e) => setAcceptTransfer(e.target.checked)}>{t("acceptTransfer")} ?</Checkbox>
                    </Form.Item>
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
