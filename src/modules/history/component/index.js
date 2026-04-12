import {Button, DatePicker, Input, Pagination, Select, Table, Tag, Tooltip} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {getHistories} from "../service";
import {SearchOutlined} from "@ant-design/icons";


const {Search} = Input;

const History = () => {
    const columns = [
        {
            title: "TT",
            key: "index",
            width: 65,
            align: "center",
            render: (_, __, index) =>
                (params.page - 1) * params.size + index + 1
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 200,
            render: (value) => (
                <span
                    style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                        fontSize: 14
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
            width: 110,
            align: "center",
            render: (status) => {
                switch (status) {
                    case "SUCCESS":
                        return <Tag
                            style={{
                                fontSize: 14,
                                padding: "4px 8px",
                                lineHeight: "20px"}}
                            color="green">Thành công</Tag>;
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
            title: 'Giá trị 1',
            dataIndex: 'value',
            key: 'value',
            width: 200,
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
            title: 'Giá trị 2',
            dataIndex: 'value2',
            key: 'value2',
            width: 180
        },
        {
            title: 'Thông tin lỗi',
            dataIndex: 'detailsError',
            key: 'detailsError',
            width: 180,
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
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 180,
            render: (value) => (
                <span>
            {value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
            )
        }
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
    const [fromDate, setFromDate] = useState(defaultFromDate)
    const [toDate, setToDate] = useState(defaultToDate)
    const histories = useSelector((state) => state.history.histories);

    const [params, setParams] = useState({
        page: 1,
        size: 10,
        type: null,
        status: null,
        fromDate: defaultFromDate,
        toDate: defaultToDate,
    });

    const onSearch = () => {
        const newParams = {
            ...params,
            page: 1,
            size: 10
        }
        setParams(newParams)
        dispatch(getHistories(newParams))
    }


    useEffect(() => {
        dispatch(getHistories(params))
    }, [isLoading])

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
                    style={{ width: 250 }}
                    placeholder={"Loại"}
                    options={[
                        { value: 'SYNC_ORDERS_WEB', label: 'Đồng bộ hoá đơn hàng WEB' },
                        { value: 'SYNC_ORDERS_SAPO', label: 'Đồng bộ hoá đơn hàng SAPO' },
                        { value: 'SYNC_ORDERS_AUTO', label: 'Đồng bộ đơn hàng tự động' },
                        { value: 'PUBLISH_INVOICE', label: 'Phát hành hoá đơn' },
                        { value: 'PUBLISH_INVOICE_AUTO', label: 'Phát hành hoá đơn tự động' },
                        { value: 'REFRESH_TOKEN_AUTO', label: 'Cập nhập token misa daily' },
                    ]}
                    onChange={(value) => {
                        setParams(prev => ({
                            ...prev,
                            type: value
                        }));
                    }}
                    allowClear
                />
                <Select
                    style={{ width: 170 }}
                    placeholder={"Trạng thái"}
                    options={[
                        { value: 'FAIL', label: 'Thất bại' },
                        { value: 'SUCCESS', label: 'Thành công' },
                    ]}
                    onChange={(value) => {
                        setParams(prev => ({
                            ...prev,
                            status: value
                        }));
                    }}
                    allowClear
                />
                <Button style={{marginLeft : 5}} type="primary" onClick={onSearch}>Tìm kiếm</Button>

            </div>
            <div style={{
                display: 'flex',
                justifyContent: ' space-between'
            }}>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={histories.content}
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
                total={histories.totalElements}
                showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} audit log`
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
        </div>

    )
}

export default History