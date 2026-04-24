import {Button, Form, DatePicker, Input, Modal, Pagination, Table, Tag, Col, Row, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";

import {
    exportExcel, exportExcelFile,
    getOrders, getSource, syncOrders, updateInFoBuyer,
} from "../service";

const {Search} = Input;

const Order = () => {
    const columns = [
        {
            title: "TT",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                (params.page - 1) * params.size + index + 1
        },
        {
            title: 'ID Đơn Hàng',
            dataIndex: 'id',
            key: 'id',
            align: "center",
            width: 170,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: 15
                    }}
                >
            {value}
               </span>
            )
        },
        {
            title: 'Nguồn',
            dataIndex: 'source',
            key: 'source',
            width: 120,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: 15
                    }}
                >
            {value}
               </span>
            )
        },
        {
            title: 'Hệ thống',
            dataIndex: 'systemName',
            key: 'systemName',
            width: 120,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: 15
                    }}
                >
            {value}
               </span>
            )
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
            {value}
               </span>
            )
        },
        {
            title: 'Trạng thái hoá đơn',
            dataIndex: 'publishInvoiceStatus',
            key: 'publishInvoiceStatus',
            align: "center",
            width: 160,
            render: (status) => {
                switch (status) {
                    case "SUCCESS":
                        return <Tag
                            style={{
                                fontSize: 14,
                                padding: "4px 8px",
                                lineHeight: "20px"}}
                            color="green">Thành công</Tag>;

                    case "INIT":
                        return <Tag
                            style={{
                                fontSize: 14,
                                padding: "4px 8px",
                                lineHeight: "20px"}}
                            color="blue">Chưa tạo hoá đơn</Tag>;

                    case "FAIL":
                        return <Tag
                            style={{
                                fontSize: 14,
                                padding: "4px 8px",
                                lineHeight: "20px"}}
                            color="red">Thất bại</Tag>;

                    default:
                        return <Tag>Không xác định</Tag>;
                }
            }
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            width: 130,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
            {value ? Number(value).toLocaleString("vi-VN") : "-"}
               </span>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            width: 170,
            render: (value) => (
                <span>
            {value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''}
                </span>
            )
        },
        {
            title: 'Ngày thanh toán ',
            dataIndex: 'dateCompleted',
            key: 'dateCompleted',
            width: 180,
            render: (value) => (
                <span>
            {value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
            )
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            align: 'center',
            render: (text, record) => (
                <span>
                    <Button style={{margin: 2, width: 165}} type="primary"
                            onClick={() => showBuyerInfo(record)}>Thông tin người mua</Button>
                    <Button style={{margin: 2, width: 165}} type="primary"
                            onClick={() => showListProduct(record)} danger>Danh sách sản phầm</Button>

                </span>
            ),
            width: 200
        },
    ];
    const getMetaValue = (metaData = [], key) => {
        const item = metaData.find(m => m.key === key);
        return item?.display_value || '';
    };
    const columnsItems = [
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {
            title: 'Dung lượng',
            key: 'dung_luong',
            render: (_, record) =>
                getMetaValue(record.meta_data || [], 'pa_dung-luong'),
        },
        {
            title: 'Số ngày',
            key: 'so_ngay',
            render: (_, record) =>
                getMetaValue(record.meta_data || [], 'pa_so-ngay'),
        },
        {title: 'Quantity', dataIndex: 'quantity', key: 'quantity'},
        {title: 'Price', dataIndex: 'price', key: 'price', render: (v) => v.toLocaleString() + ' ₫'},
        {title: 'Total', dataIndex: 'total', key: 'total', render: (v) => Number(v).toLocaleString() + ' ₫'}
    ];

    const dispatch = useDispatch();
    const [billingForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    const [isShowBilling, setIsShowBilling] = useState(false)
    const [isShowLineItems, setIsShowLineItems] = useState(false)
    const orderList = useSelector((state) => state.order.orders);
    const [lineItems, setLineItems] = useState([]);
    const [source, setSource] = useState([]);
    const defaultFromDate = dayjs()
        .subtract(7, "day")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");


    const defaultToDate = dayjs()
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
    const [fromDate, setFromDate] = useState(defaultFromDate)
    const [toDate, setToDate] = useState(defaultToDate)
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        status: null,
        search: null,
        source: null,
        systemName: null,
        fromDate: defaultFromDate,
        toDate: defaultToDate,
    });

    const showBuyerInfo = (info) => {
        // Set giá trị vào form
        setIsShowBilling(true)
        billingForm.setFieldsValue(info);
    };
    const showListProduct = (info) => {
        setLineItems(JSON.parse(info.lineItems));
        console.log(JSON.parse(info.lineItems))
        setIsShowLineItems(true)
    }

    const onSearch = (value) => {
        const newParams = {
            ...params,
            page: 1,
            size: 10,
            search: value.trim() === "" ? null : value.trim()}
        setParams(newParams)
        dispatch(getOrders(newParams))
    }
    useEffect(async () => {
       const sourceRes = await dispatch(getSource())
        setSource(sourceRes.map(item => item.name));
    }, [isLoading])

    useEffect(() => {
        dispatch(getOrders(params))
    }, [isLoading])

    const sync = async () => {
        Modal.confirm({
            title: "Xác nhận đồng bộ hoá đơn hàng từ remote",
            content: `Bạn có chắc chắn muốn đồng bộ hoá đơn hàng từ ngày ${dayjs(params.fromDate).format("DD/MM/YYYY")} đến ngày ${dayjs(params.toDate).format("DD/MM/YYYY")} đã chọn ?, vui lòng chọn ít hơn 10 ngày để tránh quá tải !`,
            okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                await dispatch(syncOrders({fromDate: fromDate, toDate: toDate}))
                setIsLoading(!isLoading)
            }
        })
    }

    const exportExcel = async () => {
        Modal.confirm({
            title: "Xác nhận export file excel",
            content: `Bạn có chắc chắn muốn export file Excel từ ngày ${dayjs(params.fromDate).format("DD/MM/YYYY")} đến ngày ${dayjs(params.toDate).format("DD/MM/YYYY")} đã chọn ?, vui lòng chọn ít hơn 10 ngày để tránh quá tải !`,
            okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                await dispatch(exportExcelFile({fromDate: fromDate, toDate: toDate}))
                setIsLoading(!isLoading)
            }
        })
    }
    return (
        <div style={{position: 'relative'}}>
            <div>
                <DatePicker
                    allowClear={false}   // ⬅️ QUAN TRỌNG
                    showTime={false}
                    defaultValue={dayjs().subtract(7, "day").startOf("day")}
                    placeholder={"Từ ngày"}
                    onChange={(value) => {
                        const startOfDay = value.hour(0).minute(0).second(0);
                        const isoString = startOfDay.format('YYYY-MM-DDTHH:mm:ss');
                        setFromDate(isoString);
                        setParams(prev => ({
                            ...prev,
                            fromDate: isoString
                        }));
                    }}
                />
                <DatePicker
                    allowClear={false}   // ⬅️ QUAN TRỌNG
                    showTime={false}
                    placeholder={"Đến ngày"}
                    defaultValue={dayjs().endOf("day")}
                    onChange={(value) => {
                        const endOfDay = value.hour(23).minute(59).second(59);
                        const isoString = endOfDay.format('YYYY-MM-DDTHH:mm:ss');
                        setToDate(isoString);
                        setParams(prev => ({
                            ...prev,
                            toDate: isoString
                        }));
                    }}
                />
                <Select
                    style={{width: 170}}
                    placeholder={"Trạng thái"}
                    options={[
                        {value: 'INIT', label: 'Chưa xuất hoá đơn'},
                        {value: 'FAIL', label: 'Thất bại'},
                        {value: 'SUCCESS', label: 'Thành công'},
                    ]}
                    onChange={(value) => {
                        setParams(prev => ({
                            ...prev,
                            status: value
                        }));
                    }}
                    allowClear
                />
                <Select
                    style={{ width: 170 }}
                    placeholder={"Nguồn"}
                    options={source?.map(item => ({
                        value: item,
                        label: item
                    }))}
                    onChange={(value) => {
                        setParams(prev => ({
                            ...prev,
                            source: value
                        }));
                    }}
                    allowClear
                />
                <Select
                    style={{ width: 160 }}
                    placeholder={"Hệ thống"}
                    options={[
                        { value: 'HUGO_SIM', label: 'HUGO_SIM' },
                    ]}
                    onChange={(value) => {
                        setParams(prev => ({
                            ...prev,
                            systemName: value
                        }));
                    }}
                    allowClear
                />
                <Search
                    placeholder="id invoice name phone email"
                    allowClear
                    style={{
                        width: 270,
                        marginBottom: 20
                    }}
                    onSearch={value => onSearch(value)}
                />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: ' space-between'
            }}>
                <div style={{marginBottom: 20}}>
                    <Button onClick={sync} type="primary">Đồng bộ đơn hàng</Button>
                </div>
                <div style={{marginBottom: 20}}>
                    <Button onClick={exportExcel} danger>Xuất File Excel từ Website </Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={orderList.content}
                bordered
                pagination={false}
                style={{
                    minHeight: 200
                }}
                scroll={{
                    x: 1100
                }}
            />
            <Pagination
                current={params.page}
                pageSize={params.size}
                total={orderList.totalElements}
                showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} đơn hàng`
                }
                onChange={(page) => {
                    setParams(prev => ({
                        ...prev,
                        page: page
                    }));
                    setIsLoading(!isLoading)
                }}
                style={{
                    minWidth: 200,
                    float: "right",
                    margin: 15,
                    alignSelf: 'flex-end'
                }}/>
            <Modal title={"Thông tin chi tiết người mua hàng"}
                   open={isShowBilling}
                   onCancel={() => {
                       setIsShowBilling(false)
                       billingForm.resetFields()
                   }}
                   footer={null}>
                <Form
                    form={billingForm}
                    name="billingForm"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 18}}
                >
                    <Form.Item
                        name="id"
                        hidden={true}>
                    </Form.Item>
                    <Form.Item
                        label="Full name : "
                        name="fullNameBuyer">
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Phone : "
                        name="numberPhoneBuyer"
                    >
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email : "
                        name="emailBuyer">
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Address : "
                        name="addressBuyer">
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 12,
                            span: 16,
                        }}>
                        <Button
                            htmlType="button"
                            type="primary"
                            style={{margin: 5}}
                            onClick={async () => {
                                await dispatch(updateInFoBuyer(billingForm.getFieldsValue()))
                                billingForm.resetFields()
                                setIsShowBilling(false)
                                setIsLoading(!isLoading)
                            }}>
                            Update Info
                        </Button>
                        <Button
                            htmlType="button"
                            style={{margin: 5}}
                            onClick={() => {
                                billingForm.resetFields()
                                setIsShowBilling(false)
                            }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title={"Danh sách sản phẩm"}
                   open={isShowLineItems}
                   onCancel={() => {
                       setIsShowLineItems(false)
                       setLineItems(null);
                   }}
                   width={800}
                   footer={null}>
                <Table
                    dataSource={lineItems}
                    columns={columnsItems}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>

    )
}

export default Order