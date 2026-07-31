import {Col, DatePicker, Pagination, Row, Select, Switch, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getGigagoOrders} from "../service";
import Search from "antd/es/input/Search";
import {getOrders, getSource, handleTogglePublish} from "../../order/service";

const GigagoOrder = () => {

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
            title: 'sapoOrderId',
            dataIndex: 'sapoOrderId',
            key: 'sapoOrderId',
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
            dataIndex: 'statusName',
            key: 'statusName',
            width: 110,
            align: "center"
        },
        {
            title: 'iccid',
            dataIndex: 'iccid',
            key: 'iccid',
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
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100
        },
        {
            title: 'Đơn giá ',
            dataIndex: 'price',
            key: 'price',
            width: 140
        },

        {
            title: 'gggPlanId ',
            dataIndex: 'gggPlanId',
            key: 'gggPlanId',
            width: 180
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 180,
            render: (value) => (
                <span>
            {value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
            )
        },
        {
            title: 'Link Gigago',
            dataIndex: 'iccid',
            key: 'iccid',
            width: 130,
            render: (iccid) => (
                <a
                    href={`https://agency.gigago.dev/my-esims?from=2026-07-28&to=2026-07-30&p=1&ps=10&iccid=${iccid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Xem đơn hàng
                </a>
            )
        }
    ];
    const defaultFromDate = dayjs()
        .subtract(30, "day")
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");

    const dispatch = useDispatch();

    const defaultToDate = dayjs()
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
    const [isLoading, setIsLoading] = useState(false)
    const gigagoOrders = useSelector((state) => state.gigagoOrder.gigagoOrders);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        keyword: null,
        fromDate: defaultFromDate,
        toDate: defaultToDate,
    });

    const onSearch = (value) => {
        const newParams = {
            ...params,
            page: 1,
            size: 10,
            keyword: value.trim() === "" ? null : value.trim()
        }
        setParams(newParams)
        dispatch(getGigagoOrders(newParams))
    }

    const handleChange = async (value) => {
        await dispatch(handleTogglePublish(source))
        setIsLoading(!isLoading)
    }

    useEffect(() => {
        dispatch(getGigagoOrders(params))
    }, [isLoading])

    const [source, setSource] = useState({});
    useEffect(async () => {
        const res = await dispatch(getSource())
        const gigagoSource = res.find(item => item.name === "GIGAGO_ORDER");
        setSource(gigagoSource)
    }, [isLoading])
    return (
        <div>
            <div>
                <DatePicker
                    allowClear={false}   // ⬅️ QUAN TRỌNG
                    showTime={false}
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
                    placeholder={"Đến ngày"}
                    defaultValue={dayjs().endOf("day")}
                    onChange={(value) => {
                        const endOfDay = value.hour(23).minute(59).second(59);
                        const isoString = endOfDay.format('YYYY-MM-DDTHH:mm:ss');
                        setParams(prev => ({
                            ...prev,
                            toDate: isoString
                        }));
                    }}
                />
                <Search
                    placeholder="Nhập iccid và sapo order id"
                    allowClear
                    style={{
                        width: 270,
                        marginBottom: 20
                    }}
                    onSearch={value => onSearch(value)}
                />
            </div>
            <Row align="middle" gutter={24} style={{marginBottom: 30}}>
                <Col>
                    <b>{source?.name}</b>
                </Col>

                <Col>
                    <b>Status:</b>
                    <Switch
                        style={{marginLeft: 8}}
                        checked={source?.publishInvoice}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={gigagoOrders.content}
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
                total={gigagoOrders.totalElements}
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
export default GigagoOrder