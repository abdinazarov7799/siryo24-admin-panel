import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, InputNumber} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const CreateEditCategory = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.category_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.category_get_all,
        hideSuccessToast: false
    });
    useEffect(() => {
        form.setFieldsValue({
            nameUz: get(itemData,'nameUz'),
            nameRu: get(itemData,'nameRu'),
            number: get(itemData,'number')
        });
    }, [itemData]);
    const onFinish = (values) => {
        const formData = {
            ...values,
        }
        if (itemData) {
            mutateEdit(
                { url: `${URLS.category_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.category_add, attributes: formData },
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
                    label={t("nameUz")}
                    name="nameUz"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("nameRu")}
                    name="nameRu"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditCategory;
