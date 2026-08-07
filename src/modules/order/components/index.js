import {
    Button,
    Form,
    DatePicker,
    Input,
    Modal,
    Pagination,
    Table,
    Tag,
    Col,
    Row,
    Select,
    Tabs,
    InputNumber, Tooltip, Card, Space
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";

import {
    exportExcel, exportExcelFile,
    getOrders, getSource, markIsSuccessFunc, syncOrders, updateInFoBuyer,
} from "../service";
import {
    downloadInvoiceByDate,
    downloadInvoiceByIds, failNotification,
    invoiceHistory,
    issueInvoiceByDate, issueInvoiceByIds,
    publishViewInvoice, successNotification
} from "../../invoice/service";
import {getGigagoOrders, refreshData, saveGigagoOrders, submitGigagoOrders} from "../../gigago-order/service";

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
                                lineHeight: "20px"
                            }}
                            color="green">Thành công</Tag>;

                    case "INIT":
                        return <Tag
                            style={{
                                fontSize: 14,
                                padding: "4px 8px",
                                lineHeight: "20px"
                            }}
                            color="blue">Chưa tạo hoá đơn</Tag>;

                    case "FAIL":
                        return <Tag
                            style={{
                                fontSize: 14,
                                padding: "4px 8px",
                                lineHeight: "20px"
                            }}
                            color="red">Thất bại</Tag>;

                    default:
                        return <Tag>Không xác định</Tag>;
                }
            }
        },
        {
            title: 'Mã hoá đơn',
            dataIndex: 'transactionID',
            key: 'transactionID',
            align: "center",
            width: 150,
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
            title: 'Giá gốc',
            dataIndex: 'originalAmount',
            key: 'originalAmount',
            align: "center",
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
            title: 'Tổng VAT',
            dataIndex: 'vatAmount',
            key: 'vatAmount',
            align: "center",
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
            title: 'Ngày xuất hoá đơn',
            dataIndex: 'issueDateInvoice',
            align: "center",
            key: 'issueDateInvoice',
            width: 160,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
            {value ? dayjs(value).format('YYYY-MM-DD') : ''}
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
                    <Button style={{margin: 2, width: 170}} type="primary"
                            disabled={record.transactionID == null}
                            onClick={() => publishView(record)}>Xem hoá đơn</Button>
                    <Button style={{margin: 2, width: 170}} type="primary"
                            onClick={() => {
                                showBuyerInfo(record)
                                dispatch(invoiceHistory({orderId: record.id}))
                                dispatch(getGigagoOrders({
                                    page: 1,
                                    size: 9999,
                                    keyword: record.id,
                                    fromDate: null,
                                    toDate: null,
                                }))
                            }}>Thông tin chi tiết</Button>
                    <Button style={{margin: 2, width: 170}} type="primary"
                            onClick={() => markIsSuccess(record.id)} disabled={record.transactionID !== null}>Xuất hoá đơn bên ngoài</Button>

                </span>
            ),
            width: 200
        },
    ];
    const getMetaValue = (metaData = [], key) => {
        const item = metaData.find(m => m.key === key);
        return item?.display_value || '';
    };

    const columnsGigagoOrder = [
        {
            title: "TT",
            key: "index",
            width: 55,
            align: "center",
            render: (_, __, index) =>
                (params.page - 1) * params.size + index + 1
        },
        {
            title: 'Sku',
            dataIndex: 'sku',
            key: 'sku',
            width: 120,
            align: "center"
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'statusName',
            key: 'statusName',
            width: 100,
            align: "center"
        },
        {
            title: 'iccid',
            dataIndex: 'iccid',
            key: 'iccid',
            width: 150,
            ellipsis: {
                showTitle: false
            },
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80
        },

        {
            title: 'gggPlanId ',
            dataIndex: 'gggPlanId',
            key: 'gggPlanId',
            width: 120
        },

        {
            title: 'Ngày đặt hàng',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 120,
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
                    <Button style={{margin: 5, width: 100}} type="primary"
                            hidden={record.iccid != null}
                            loading={submitting}
                            onClick={async () => await submitGigagoOrder(record)}>Đặt hàng</Button>
                    <Button style={{margin: 5, width: 100}} type="primary"
                            hidden={record.iccid !== null}
                                              onClick={async () =>{
                                                  await refreshData({requestId:record.requestId});
                                                  await dispatch(getGigagoOrders({
                                                      page: 1,
                                                      size: 9999,
                                                      keyword: record.sapoOrderId,
                                                      fromDate: null,
                                                      toDate: null,
                                                  }));
                                              }}>Refresh</Button>
                     <a hidden={record.iccid === null}
                        href={`https://agency.gigago.dev/my-esims?p=1&ps=10&iccid=${record.iccid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                    Xem đơn hàng</a>
                </span>
            ),
            width: 120
        }
    ];


    const columnsInvoiceItems = [
        {title: 'Id đơn hàng ', dataIndex: 'refID', key: 'refID'},
        {title: 'Mã hoá đơn', dataIndex: 'transactionID', key: 'transactionID'},
        {
            title: 'Ngày Misa ghi nhận', dataIndex: 'invDate', key: 'invDate',
            render: (value) => (
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
            {value ? dayjs(value).format("DD/MM/YYYY") : ""}
        </span>
            )
        },
        {title: 'Mã lỗi', dataIndex: 'errorCode', key: 'errorCode'},
        {title: 'Chi tiết mã lỗi', dataIndex: 'descriptionErrorCode', key: 'descriptionErrorCode'},
        {
            title: 'Thời gian tạo', dataIndex: 'createdDate', key: 'createdDate',
            render: (value) => (
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
            {value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : ""}
        </span>
            )
        },
    ];
    const columnsItems = [
        {title: 'Sku', dataIndex: 'sku', key: 'sku'},
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
    const publishInvoiceItem = useSelector((state) => state.order.invoiceHistory);
    const gigagoOrders = useSelector((state) => state.gigagoOrder.gigagoOrders);

    const [isShowDetail, setIsShowDetail] = useState(false)
    const orderList = useSelector((state) => state.order.orders);
    const [lineItems, setLineItems] = useState([]);
    const [source, setSource] = useState([]);
    const defaultFromDate = dayjs()
        .subtract(7, "day")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [transIds, setTransIds] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys);
            setTransIds(selectedRows.map(row => row.transactionID))
        },
    };

    const [submitting, setSubmitting] = useState(false);

    const submitGigagoOrder = async (record) => {
        if (submitting) {
            return;
        }

        try {
            setSubmitting(true);

            const res = await submitGigagoOrders({
                requestId: record.requestId
            });

            if (res.data.data === true) {
                successNotification("Thành công");

                dispatch(getGigagoOrders({
                    page: 1,
                    size: 9999,
                    keyword: record.sapoOrderId,
                    fromDate: null,
                    toDate: null,
                }));
            } else {
                const message = res.data.message || "Thất bại, vui lòng liên hệ admin";
                failNotification(message);
            }
        } finally {
            setSubmitting(false);
        }
    };


    const publishView = async (info) => {
        await publishViewInvoice({transId: info.transactionID});

    };
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
    const [sourceName, setSourceName] = useState(defaultFromDate);
    const markIsSuccess = (id) => {
        let selectedDate = dayjs().format("YYYY-MM-DD");
        let vat = 0;
        Modal.confirm({
            title: "Xác nhận đánh đấu đơn hàng",
            content: (
                <div>
                    <p>
                        Bạn có chắc chắn muốn đánh dấu đơn hàng này đã xuất hóa đơn trực bên ngoài không?
                    </p>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h6>Nhập số tiền VAT:</h6>
                        <Input style={{width: "150px"}}
                               onChange={(e) => {
                                   vat = e.target.value;
                               }}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h6>Nhập ngày:</h6>
                        <DatePicker
                            style={{width: "150px"}}
                            defaultValue={dayjs(selectedDate)}
                            onChange={(date) => {
                                selectedDate = date.format("YYYY-MM-DD");
                            }}
                        />
                    </div>
                </div>
            ), okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                await dispatch(markIsSuccessFunc({id: id, date: selectedDate, vat: vat}));
                setIsLoading(!isLoading)
            }
        })
    }

    const showBuyerInfo = (info) => {
        // Set giá trị vào form
        setSourceName(info.source)
        setIsShowDetail(true)
        setLineItems(JSON.parse(info.lineItems));
        billingForm.setFieldsValue(info);
    };

    const onSearch = (value) => {
        const newParams = {
            ...params,
            page: 1,
            size: 10,
            search: value.trim() === "" ? null : value.trim()
        }
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

    const sync = async (type) => {
        Modal.confirm({
            title: "Xác nhận đồng bộ hoá đơn hàng từ remote",
            content: `Bạn có chắc chắn muốn đồng bộ hoá đơn hàng từ ngày ${dayjs(params.fromDate).format("DD/MM/YYYY")} đến ngày ${dayjs(params.toDate).format("DD/MM/YYYY")} đã chọn ?, vui lòng chọn ít hơn 10 ngày để tránh quá tải !`,
            okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                await dispatch(syncOrders({fromDate: fromDate, toDate: toDate, type: type}))
                setIsLoading(!isLoading)
            }
        })
    }

    const exportExcel = async () => {
        Modal.confirm({
            title: "Xác nhận export file excel",
            content: `Bạn có chắc chắn muốn export file Excel từ ngày ${dayjs(params.fromDate).format("DD/MM/YYYY")} đến ngày ${dayjs(params.toDate).format("DD/MM/YYYY")} đã chọn ?`,
            okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                await dispatch(exportExcelFile({fromDate: fromDate, toDate: toDate}))
                setIsLoading(!isLoading)
            }
        })
    }

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [gigagoForm] = Form.useForm();

    const handleCreateGigagoOrder = async (values) => {
        await saveGigagoOrders(values);
        await dispatch(getGigagoOrders({
            page: 1,
            size: 9999,
            keyword: values.sapoOrderId,
            fromDate: null,
            toDate: null,
        }));
        gigagoForm.resetFields();
        setShowCreateForm(false);

    };

    const downloadInvoice = () => {
        Modal.confirm({
            title: "Xác nhận tải hoá đơn",
            content: selectedRowKeys && selectedRowKeys.length > 0
                ? `Bạn có chắc chắn muốn tải hoá đơn cho ${selectedRowKeys.length} đơn hàng đã chọn?`
                : `Bạn có chắc chắn muốn tải hoá đơn từ ngày ${dayjs(params.fromDate).format("DD/MM/YYYY")} đến ngày ${dayjs(params.toDate).format("DD/MM/YYYY")} đã chọn?`,
            okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                if (transIds == null || transIds.length === 0) {
                    await downloadInvoiceByDate(params)
                } else {
                    await downloadInvoiceByIds(transIds)
                }
            }
        })
    }
    const issueInvoice = () => {
        Modal.confirm({
            title: "Xác nhận xuất hoá đơn",
            content: selectedRowKeys && selectedRowKeys.length > 0
                ? `Bạn có chắc chắn muốn xuất hoá đơn cho ${selectedRowKeys.length} đơn hàng đã chọn?`
                : `Bạn có chắc chắn muốn xuất hoá đơn từ ngày ${dayjs(params.fromDate).format("DD/MM/YYYY")} đến ngày ${dayjs(params.toDate).format("DD/MM/YYYY")} đã chọn?`,
            okText: "Xác nhận",
            cancelText: "Huỷ",
            okType: "primary",
            async onOk() {
                if (!selectedRowKeys || selectedRowKeys.length === 0) {
                    await dispatch(issueInvoiceByDate(params));
                } else {
                    await dispatch(issueInvoiceByIds(selectedRowKeys));
                }
                setIsLoading(prev => !prev);
            }
        });
    };

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
                    style={{width: 170}}
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
                    style={{width: 160}}
                    placeholder={"Hệ thống"}
                    options={[
                        {value: 'HUGO_SIM', label: 'HUGO_SIM'},
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
                    <Button style={{margin: 5, width: 140}} onClick={() => sync("SAPO")} danger>Đồng bộ sapo</Button>
                    <Button style={{margin: 5, width: 140}} onClick={() => sync("WEB")} danger>Đồng bộ web</Button>
                    <Button style={{margin: 5, width: 140}} onClick={exportExcel} danger>Export Excel </Button>
                    <Button style={{margin: 5, width: 140}} onClick={issueInvoice} danger>Xuất Hoá Đơn</Button>
                    <Button style={{margin: 5, width: 140}} onClick={downloadInvoice} danger>Tải hoá đơn</Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={orderList.content}
                rowSelection={rowSelection}   // 👈 thêm dòng này
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

            <Modal
                title="Chi tiết đơn hàng"
                open={isShowDetail}
                onCancel={() => setIsShowDetail(false)}
                width={1000}
                footer={null}
            >
                <Tabs
                    defaultActiveKey="customer"
                    items={[
                        {
                            key: 'customer',
                            label: 'Thông tin khách hàng',
                            children: (
                                <Form
                                    form={billingForm}
                                    name="billingForm"
                                >
                                    <Form.Item name="id" hidden/>

                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Full name"
                                                name="fullNameBuyer"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <Input/>
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                label="Phone"
                                                name="numberPhoneBuyer"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <Input/>
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                label="Email"
                                                name="emailBuyer"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <Input/>
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                label="Address"
                                                name="addressBuyer"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <Input/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Tổng tiền"
                                                name="total"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <InputNumber
                                                    style={{width: '100%'}}
                                                    readOnly
                                                    controls={false}
                                                    formatter={(value) =>
                                                        value ? Number(value).toLocaleString('vi-VN') : ''
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                label="Mã hoá đơn"
                                                name="transactionID"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <Input readOnly/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Tiền gốc"
                                                name="originalAmount"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <InputNumber readOnly
                                                             style={{width: '100%'}}
                                                             formatter={(value) =>
                                                                 value ? Number(value).toLocaleString('vi-VN') : ''
                                                             }/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Tiền thuế VAT"
                                                name="vatAmount"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <InputNumber readOnly
                                                             style={{width: '100%'}}
                                                             formatter={(value) =>
                                                                 value ? Number(value).toLocaleString('vi-VN') : ''
                                                             }/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Note"
                                                name="note"
                                                labelCol={{span: 8}}
                                                wrapperCol={{span: 16}}
                                            >
                                                <Input.TextArea rows={3}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item style={{textAlign: 'center'}}>
                                        <Button htmlType="button" type="primary" style={{margin: 5}}
                                                onClick={async () => {
                                                    await dispatch(updateInFoBuyer(billingForm.getFieldsValue()))
                                                    billingForm.resetFields()
                                                    setIsShowDetail(false)
                                                    setIsLoading(!isLoading)
                                                }}> Update Info </Button>
                                        <Button htmlType="button" style={{margin: 5}}
                                                onClick={() => {
                                                    billingForm.resetFields()
                                                    setIsShowDetail(false)
                                                }}> Cancel </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'invoices',
                            label: 'Lịch sử hóa đơn',
                            children: (
                                <Table
                                    dataSource={publishInvoiceItem}
                                    columns={columnsInvoiceItems}
                                    rowKey="id"
                                    pagination={false}
                                />
                            ),
                        },
                        {
                            key: 'products',
                            label: 'Sản phẩm',
                            children: (
                                <Table
                                    dataSource={lineItems}
                                    columns={columnsItems}
                                    rowKey="id"
                                    pagination={false}
                                />
                            ),
                        },
                        ...(sourceName !== 'WEBSITE'
                            ? [{
                                key: 'gigagoOrder',
                                label: 'Thông tin gigago orders',
                                children: (
                                    <div>
                                        <div
                                            style={{
                                                marginBottom: 16,
                                                display: 'flex',
                                                justifyContent: 'flex-end'
                                            }}
                                        >
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    setShowCreateForm(!showCreateForm);
                                                    gigagoForm.setFieldsValue({
                                                        sapoOrderId: billingForm.getFieldValue("id"), // giá trị truyền vào
                                                    });
                                                }}
                                            >
                                                {showCreateForm ? 'Đóng' : 'Tạo thủ công'}
                                            </Button>
                                        </div>

                                        {showCreateForm && (
                                            <Card size="small" style={{marginBottom: 16}}>
                                                <Form
                                                    form={gigagoForm}
                                                    layout="vertical"
                                                    onFinish={handleCreateGigagoOrder}
                                                >
                                                    <Row gutter={16}>
                                                        <Col span={7}>
                                                            <Form.Item
                                                                label="Sapo Order ID"
                                                                name="sapoOrderId"
                                                                rules={[{required: true}]}
                                                            >
                                                                <Input readOnly/>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={7}>
                                                            <Form.Item
                                                                label="ICCID"
                                                                name="iccid"
                                                                rules={[{required: true}]}
                                                            >
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={6}>
                                                            <Form.Item
                                                                label="SKU"
                                                                name="sku"
                                                                rules={[{required: true}]}
                                                            >
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Space>
                                                        <Button type="primary" htmlType="submit">
                                                            Lưu
                                                        </Button>

                                                        <Button
                                                            onClick={() => {
                                                                gigagoForm.resetFields();
                                                                setShowCreateForm(false);
                                                            }}
                                                        >
                                                            Hủy
                                                        </Button>
                                                    </Space>
                                                </Form>
                                            </Card>
                                        )}
                                        <Table
                                            dataSource={gigagoOrders.content}
                                            columns={columnsGigagoOrder}
                                            rowKey="id"
                                            pagination={false}
                                        />
                                    </div>
                                ),
                            }]
                            : [])
                    ]}
                />
            </Modal>
        </div>

    )
}

export default Order