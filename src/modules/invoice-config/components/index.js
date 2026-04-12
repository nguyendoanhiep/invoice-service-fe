import {Button, Input, Modal, Table} from "antd";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";

import {
    getSource, handleTogglePublish, syncOrders,
} from "../../order/service";
import dayjs from "dayjs";

const {Search} = Input;

const InvoiceConfig = () => {
    const columns = [
        {
            title: "TT",
            key: "index",
            width: 40,
            align: "center",
            render: (_, __, index) => index + 1
        },
        {
            title: 'Tên source',
            dataIndex: 'name',
            key: 'name',
            align: "center",
            width: 150,
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
            title: 'Cấu hình thời gian',
            dataIndex: 'cronJobValue',
            key: 'cronJobValue',
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
            title: 'Trạng thái',
            dataIndex: 'publishInvoice',
            key: 'publishInvoice',
            width: 110,
            render: (value) => {
                return (
                    <span
                        style={{
                            textTransform: "uppercase",
                            fontWeight: 500,
                            fontSize: 12,
                            padding: "4px 10px",
                            borderRadius: 20,
                            color: "#fff",
                            backgroundColor: value ? "#52c41a" : "#ff4d4f",
                            display: "inline-block",
                            minWidth: 120,
                            textAlign: "center"
                        }}
                    >
                {value ? "ĐANG HOẠT ĐỘNG" : "NGỪNG HOẠT ĐỘNG"}
            </span>
                );
            }
        },
        {
            title: 'Action',
            dataIndex: '',

            key: 'x',
            fixed: 'right',
            align: 'center',
            render: (text, record) => (
                <span>
                    <Button
                        style={{ margin: 2, width: 130 }}
                        type="primary"
                        danger={record.publishInvoice}
                        onClick={async () => {
                            let value = record.publishInvoice ? "tắt" : "bật"
                            Modal.confirm({
                                title: `Xác nhận ${value} xuất hoá đơn`,
                                content: `Bạn có chắc chắn muốn ${value} xuất hoá đơn cho nguồn này không ?`,
                                okText: "Xác nhận",
                                cancelText: "Huỷ",
                                okType: "primary",
                                async onOk() {
                                    await dispatch(handleTogglePublish(record))
                                    setIsLoading(!isLoading)

                                }
                            })

                        }}
                    >
                  {record.publishInvoice ? "Tắt xuất hoá đơn" : "Bật xuất hoá đơn"}
                   </Button>
                </span>
            ),
            width: 140
        },
    ];

    const dispatch = useDispatch();
    const [source, setSource] = useState([]);
    const [isLoading, setIsLoading] = useState();

    useEffect(async () => {
       const source = await dispatch(getSource())
        setSource(source)
    }, [isLoading])

    return (
        <div style={{position: 'relative'}}>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={source}
                bordered
                pagination={false}
                style={{
                    minHeight: 200
                }}
                scroll={{
                    x: 900
                }}
            />
        </div>

    )
}

export default InvoiceConfig