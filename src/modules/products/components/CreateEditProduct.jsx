import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Flex, Form, Input, InputNumber, message, Select, Upload} from "antd";
const { Dragger } = Upload;
import {InboxOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import Resizer from "react-image-file-resizer";

const CreateEditProduct = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [imageUrl,setImgUrl] = useState(get(itemData,'imageUrl'));
    const [searchCategory,setSearchCategory] = useState(null);
    const [searchProduct,setSearchProduct] = useState(null);
    const [searchSeller,setSearchSeller] = useState(null);
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
                size: 1000
            }
        }
    })
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
    const { data:sellers,isLoading:isLoadingSellers } = useGetAllQuery({
        key: KEYS.seller_get_all,
        url: URLS.seller_get_all,
        params: {
            params: {
                search: searchSeller,
                size: 1000
            }
        }
    })
    useEffect(() => {
        form.setFieldsValue({
            name: get(itemData,'name'),
            country: get(itemData,'country'),
            manufacturer: get(itemData,'manufacturer'),
            price: get(itemData,'price'),
            analogs: get(itemData,'analogs') ? [...get(itemData,'analogs')?.map((item) => get(item, 'id'))] : [],
            alternativeNames: get(itemData,'alternativeNames') ? [...get(itemData,'alternativeNames')?.map(item => item)] : [],
            categoryId: get(itemData,'categoryId'),
            sellerId: get(itemData,'sellerId'),
        });
        setImgUrl(get(itemData,'imageUrl'))
    }, [itemData]);
    const onFinish = (values) => {
        const formData = {
            ...values,
            imageUrl,
            alternativeNames: get(values,'alternativeNames') ? [...get(values,'alternativeNames')?.map((item) => get(item, 'name'))] : []
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
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                400,
                400,
                "WEBP",
                60,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });
    const beforeUpload = async (file) => {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error(t('Image must smaller than 10MB!'));
            return;
        }
        const uri = await resizeFile(file);
        const resizedImage = await fetch(uri).then(res => res.blob());
        return new Blob([resizedImage],{ type: "webp"});
    };
    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        UploadImage(
            { url: URLS.image_upload, attributes: formData, config: { headers: { 'Content-Type': 'multipart/form-data' } } },
            {
                onSuccess: ({ data }) => {
                    onSuccess(true);
                    setImgUrl(data);
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
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
                    label={t("Category")}
                    name="categoryId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Category")}
                        optionFilterProp="children"
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
                    label={t("Seller")}
                    name="sellerId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Seller")}
                        optionFilterProp="children"
                        defaultValue={get(itemData,'sellerId')}
                        onSearch={(e) => setSearchSeller(e)}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingSellers}
                        options={get(sellers,'data.data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'organization')} / ${get(item,'channel')}`
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Analogs")}
                    name="analogs"
                >
                    <Select
                        showSearch
                        mode={"multiple"}
                        placeholder={t("Analogs")}
                        optionFilterProp="children"
                        onSearch={(e) => setSearchProduct(e)}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingProducts}
                        options={get(products,'data.data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'name')} / ${get(item,'seller')}`
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("name")}
                    name="name"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.List name="alternativeNames">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map((field, index) => (
                                    <div key={field.key}>
                                        <Form.Item
                                            name={[index, "name"]}
                                            label={index+1 + " " + t("Alternative name")}
                                            rules={[{ required: true }]}
                                        >
                                            <Flex>
                                                <Input placeholder={t("name")} />
                                                <Button
                                                    danger
                                                    onClick={() => remove(field.name)}
                                                    icon={<MinusCircleOutlined />}
                                                    style={{marginLeft: 8}}
                                                />
                                            </Flex>
                                        </Form.Item>

                                    </div>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                    >
                                        <PlusOutlined /> {t("Add alternative")}
                                    </Button>
                                </Form.Item>
                            </div>
                        );
                    }}
                </Form.List>

                <Form.Item
                    label={t("country")}
                    name="country"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("manufacturer")}
                    name="manufacturer"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>


                <Form.Item
                    label={t("price")}
                    name="price"
                    rules={[{required: true,}]}
                >
                    <InputNumber controls={false} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.5} aspect={400/400}>
                        <Dragger
                            maxCount={1}
                            multiple={false}
                            accept={".jpg,.png,jpeg,svg"}
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                        </Dragger>
                    </ImgCrop>
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

export default CreateEditProduct;
