import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber, Select} from "antd";
const { TextArea } = Input;
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const CreateEditSeller = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(get(itemData,'active',true));
    const [categoryId,setCategoryId] = useState(null);
    const [searchCategory,setSearchCategory] = useState(null);
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.product_get_all,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.product_get_all,
        hideSuccessToast: false
    });
    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });
    const { data:categories,isLoading:isLoadingCategory } = useGetAllQuery({
        key: KEYS.category_get_all,
        url: URLS.category_get_all,
        params: {
            params: {
                search: searchCategory,
                size: 200
            }
        }
    })
    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
            categoryId
        }
        if (itemData){
            mutateEdit(
                { url: `${URLS.product_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.product_add, attributes: formData },
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
                initialValues={{
                    nameUz: get(itemData,'nameUz'),
                    nameRu: get(itemData,'nameRu'),
                    descriptionUz: get(itemData,'descriptionUz'),
                    descriptionRu: get(itemData,'descriptionRu'),
                    number: get(itemData,'number')
                }}
            >
                <Form.Item
                    label={t("Category")}
                    name="categoryId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Category")}
                        optionFilterProp="children"
                        defaultValue={get(itemData,'categories.id')}
                        onChange={(e) => setCategoryId(e)}
                        onSearch={(e) => setSearchCategory(e)}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingCategory}
                        options={get(categories,'data.data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`
                            }
                        })}
                    />
                </Form.Item>
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
                    label={t("descriptionUz")}
                    name="descriptionUz"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("descriptionRu")}
                    name="descriptionRu"
                    rules={[{required: true,}]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label={t("Order")}
                    name="number"
                    rules={[{required: true,}]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is Active")} ?</Checkbox>
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

export default CreateEditSeller;
