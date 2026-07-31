import {DatePicker, Pagination, Select, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getGigagoOrders, getProducts} from "../service";
import Search from "antd/es/input/Search";
import {getOrders} from "../../order/service";

const Product = () => {

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
            title: 'sku',
            dataIndex: 'sku',
            key: 'sku',
            width: 150,
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
            title: 'gggPlanId',
            dataIndex: 'gggPlanId',
            key: 'gggPlanId',
            width: 160,
            align: "center"
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            width: 200
        },
        {
            title: 'Số ngày',
            dataIndex: 'soNgay',
            key: 'soNgay',
            width: 100
        },
        {
            title: 'Dung lượng ',
            dataIndex: 'dungLuong',
            key: 'dungLuong',
            width: 140
        },

        {
            title: 'permalink ',
            dataIndex: 'permalink',
            key: 'permalink',
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
            title: 'Đơn gía',
            dataIndex: 'price',
            key: 'price',
            width: 180
        }
    ];

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const products = useSelector((state) => state.product.products);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        keyword: null
    });

    const onSearch = (value) => {
        const newParams = {
            ...params,
            page: 1,
            size: 10,
            keyword: value.trim() === "" ? null : value.trim()
        }
        setParams(newParams)
        dispatch(getProducts(newParams))
    }

    useEffect(() => {
        dispatch(getProducts(params))
    }, [isLoading])

    return (
        <div>
            <div>
                <Search
                    placeholder="Nhập gggPlanId và tên sản phẩm"
                    allowClear
                    style={{
                        width: 290,
                        marginBottom: 20
                    }}
                    onSearch={value => onSearch(value)}
                />
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={products.content}
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
                total={products.totalElements}
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
export default Product