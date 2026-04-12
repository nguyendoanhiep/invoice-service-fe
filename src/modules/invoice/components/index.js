import {Button, DatePicker, Input, Modal, Pagination, Select, Table, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";

import {
    getOrders, getSource,
} from "../../order/service";
import {
    downloadInvoiceByDate,
    downloadInvoiceByIds, invoiceHistory,
    issueInvoiceByDate,
    issueInvoiceByIds,
    publishViewInvoice, unpublishviewInvoice
} from "../service";

const {Search} = Input;

const Invoice = () => {
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
            width: 210,
            render: (id) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
            {id}
        </span>
            )
        },
        {
            title: 'Nguồn',
            dataIndex: 'source',
            key: 'source',
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
            title: 'Ngày tạo',
            dataIndex: 'dateCreated',
            align: "center",
            key: 'dateCreated',
            width: 190,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                        fontSize: 15
                    }}
                >
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
                    <Button style={{margin: 2, width: 130}} type="primary"
                            onClick={() => unpublishview(record)}>Hoá đơn nháp</Button>
                    <Button style={{margin: 2, width: 130}} type="primary"
                            disabled={record.publishInvoiceStatus !== 'SUCCESS'}
                            onClick={() => publishView(record)}>Xem hoá đơn</Button>
                     <Button style={{margin: 2, width: 130}} type="primary"
                             disabled={record.publishInvoiceStatus === 'INIT'}
                             onClick={() => {
                                 dispatch(invoiceHistory({orderId: record.id}))
                                 setIsShowPublishInvoiceItem(true)
                             }}>Lịch sử hoá đơn</Button>
                </span>
            ),
            width: 160
        },
    ];
    const columnsItems = [
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
    const defaultFromDate = dayjs()
        .subtract(7, "day")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");

    const defaultToDate = dayjs()
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [isShowPublishInvoiceItem, setIsShowPublishInvoiceItem] = useState(false)
    const orderList = useSelector((state) => state.order.orders);
    const publishInvoiceItem = useSelector((state) => state.order.invoiceHistory);


    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: null,
        status: null,
        source: null,
        systemName: null,
        fromDate: defaultFromDate,
        toDate: defaultToDate,
    });

    const publishView = async (info) => {
        await publishViewInvoice({transId: info.transactionID});

    };

    const unpublishview = async (info) => {
        await unpublishviewInvoice({id: info.id});

    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [transIds, setTransIds] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys);
            setTransIds(selectedRows.map(row => row.transactionID))
        },
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

    useEffect(() => {
        dispatch(getOrders(params))
    }, [isLoading])

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
    const [source, setSource] = useState([]);
    useEffect(async () => {
        const sourceRes = await dispatch(getSource())
        setSource(sourceRes.map(item => item.name));
    }, [])
    return (
        <div style={{position: 'relative'}}>
            <div>
                <DatePicker
                    showTime={false}
                    allowClear={false}   // ⬅️ QUAN TRỌNG
                    defaultValue={dayjs().subtract(7, "day").startOf("day")}
                    placeholder={"Từ ngày"}
                    onChange={(value) => {
                        const startOfDay = value.hour(0).minute(0).second(0);
                        const isoString = startOfDay.format('YYYY-MM-DDTHH:mm:ss');
                        setParams(prev => ({
                            ...prev,
                            fromDate: isoString
                        }));
                    }}
                />
                <DatePicker
                    allowClear={false}   // ⬅️ QUAN TRỌNG
                    showTime={false}
                    defaultValue={dayjs().endOf("day")}
                    placeholder={"Đến ngày"}
                    onChange={(value) => {
                        const endOfDay = value.hour(23).minute(59).second(59);
                        const isoString = endOfDay.format('YYYY-MM-DDTHH:mm:ss');
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
                        width: 260,
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
                    <Button onClick={issueInvoice} danger>Xuất Hoá Đơn</Button>
                    <Button style={{margin: 5, width: 120}} type="primary"
                            onClick={downloadInvoice}>Tải hoá đơn</Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={orderList.content}
                rowSelection={rowSelection}   // 👈 thêm dòng này
                pagination={false}
                bordered
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

            <Modal title={"Danh sách sản phẩm"}
                   open={isShowPublishInvoiceItem}
                   onCancel={() => {
                       setIsShowPublishInvoiceItem(false)
                   }}
                   width={1000}
                   footer={null}>
                <Table
                    dataSource={publishInvoiceItem}
                    columns={columnsItems}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>

    )
}

export default Invoice