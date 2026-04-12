import React, {useEffect, useMemo, useRef, useState} from "react";
import {getReport, getReportDetails} from "../../order/service";
import {useDispatch} from "react-redux";
import {Checkbox, Select} from "antd";
import ChartSection from "./ChartSection";

const Home = () => {
    const dispatch = useDispatch();
    const [reportDetails, setReportDetails] = useState([]);
    const [reportDetailsHasVAT, setReportDetailsHasVAT] = useState([]);
    const [deductVat, setDeductVat] = useState(false);
    const [report, setReport] = useState([]);
    const [reportBy, setReportBy] = useState("totalAmount");
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalVatAmount, setTotalVatAmount] = useState(0);
    const [params, setParams] = useState({
        systemName: "HUGO_SIM",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    });
    const handleDeductVatChange = (checked) => {
        setDeductVat(checked)
        setReportDetailsHasVAT(reportDetails.map(item => ({
            ...item,
            totalAmount: checked
                ? (Number(item.totalAmount) || 0) -
                (Number(item.totalVatAmount) || 0)
                : (Number(item.totalAmount) || 0) +
                (Number(item.totalVatAmount) || 0)
        })));
    };
    const daySelectRef = useRef(null);
    useEffect(async () => {
        const fetchData = async () => {
            const res = await dispatch(getReportDetails(params));
            setReportDetails(res);
        };
        await fetchData()
    }, [params.year]);

    useEffect(async () => {
        const reportRes = await dispatch(getReport(params))
        setReport(reportRes)
        // ===== TÍNH TỔNG =====
        let sumOrders = 0;
        let sumAmount = 0;
        let sumVat = 0;

        reportRes?.forEach(item => {
            sumOrders += Number(item.totalOrders || 0);
            sumAmount += Number(item.totalAmount || 0);
            sumVat += Number(item.totalVatAmount || 0);
        });

        setTotalOrders(sumOrders);
        setTotalAmount(sumAmount);
        setTotalVatAmount(sumVat);
    }, [params]);

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between", // trái - phải tách ra
                alignItems: "flex-start",
                marginBottom: 20
            }}>
                <div style={{minHeight: 160, minWidth: '30%'}}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",        // khoảng cách giữa 2 thẻ
                        marginBottom: "16px"
                    }}>
                        <h6>Chọn hệ thống : </h6>
                        <Select
                            style={{width: 150}}
                            placeholder={"Hệ thống"}
                            defaultValue={"HUGO_SIM"}
                            options={[
                                {value: 'HUGO_SIM', label: 'HUGO_SIM'},
                            ]}
                            onChange={(value) => {
                                setParams(prev => ({
                                    ...prev,
                                    systemName: value
                                }));
                            }}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",        // khoảng cách giữa 2 thẻ
                        marginBottom: "16px"
                    }}>
                        <h6>Chọn dữ liệu : </h6>
                        <Select
                            style={{width: 150}}
                            defaultValue={"totalAmount"}
                            options={[
                                {value: 'totalAmount', label: 'Tổng tiền'},
                                {value: 'totalOrders', label: 'Đơn hàng'},
                            ]}
                            onChange={(value) => {
                                setReportBy(value)
                            }}
                        />
                    </div>
                    <div style={{marginBottom: 20}}>
                        <Select
                            style={{width: 150}}
                            placeholder={"Năm"}
                            defaultValue={params.year}
                            options={Array.from({length: 3}, (_, i) => {
                                const currentYear = new Date().getFullYear();
                                const year = currentYear - i; // ví dụ lấy 5 năm gần nhất
                                return {value: year, label: `${year}`};
                            })}
                            onChange={(value) => {
                                setParams(prev => ({
                                    ...prev,
                                    year: value
                                }));
                            }}
                        />
                        <Select
                            style={{width: 150}}
                            placeholder={"Tháng"}
                            defaultValue={params.month}
                            options={[
                                {
                                    value: null,
                                    label: "Tất cả",
                                },
                                ...Array.from({length: 12}, (_, index) => {
                                    const month = index + 1;
                                    return {
                                        value: month,               // số
                                        label: `Tháng ${month}`,    // text hiển thị
                                    };
                                })
                            ]}
                            onChange={(value) => {
                                setParams(prev => ({
                                    ...prev,
                                    month: value
                                }));
                            }}
                        />

                        <Select
                            style={{width: 150}}
                            ref={daySelectRef}
                            placeholder="Ngày"
                            disabled={params.month == null}
                            popupMatchSelectWidth={false}   // ✅ QUAN TRỌNG
                            labelInValue   // ✅ QUAN TRỌNG
                            value={
                                params.day == null
                                    ? {value: null, label: "Tất cả"}
                                    : {value: params.day, label: `Ngày ${params.day}`}
                            }

                            popupRender={() => (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(6, 1fr)", // 4 cột
                                        gap: 6,
                                        padding: 8,
                                        maxHeight: 220,
                                        minWidth: 300,
                                        overflowY: "auto",
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            setParams(p => ({...p, day: null}))
                                            daySelectRef.current?.blur();
                                        }}
                                        style={{cursor: "pointer", textAlign: "center", marginTop: 5, minWidth: 30}}
                                    >
                                        Tất cả
                                    </div>

                                    {Array.from({length: 31}, (_, i) => {
                                        const day = i + 1;
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => {
                                                    setParams(p => ({...p, day}))
                                                    daySelectRef.current?.blur();
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    padding: 6,
                                                    textAlign: "center",
                                                    borderRadius: 6,
                                                    background:
                                                        params.day === day ? "#e6f4ff" : undefined,
                                                    minWidth: 30
                                                }}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        />

                    </div>
                </div>
                <div
                    style={{
                        background: "#ffffff",
                        padding: "20px 24px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        border: "1px solid #f0f0f0",
                        minWidth: 300
                    }}
                >
                    <h4 style={{marginBottom: 12}}>📊 Tổng quan</h4>

                    <div style={{marginBottom: 8}}>
                        <span style={{color: "#888"}}>Tổng đơn:</span>
                        <span style={{float: "right", fontWeight: 600}}>{totalOrders}</span>
                    </div>

                    <div style={{marginBottom: 8}}>
                        <span style={{color: "#888"}}>Tổng tiền:</span>
                        <span style={{
                            float: "right",
                            fontWeight: 600,
                            color: "#1677ff"
                        }}>{totalAmount.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div>
                        <span style={{color: "#888"}}>Tổng VAT:</span>
                        <span style={{
                            float: "right",
                            fontWeight: 600,
                            color: "#52c41a"
                        }}>{totalVatAmount.toLocaleString("vi-VN")} đ</span>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",      // quan trọng
                    gap: "16px",
                }}
            >
                {report.map((item, index) => (
                    <div
                        key={item.source + index}
                        style={{
                            maxWidth: "300px",
                            flex: "1 1 300px",  // tối thiểu 200px, đủ chỗ thì giãn ra
                            padding: "16px",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            background: "#fafafa",
                        }}
                    >
                        <h5>{item.source}</h5>
                        <p>Đơn hàng: {item.totalOrders}</p>
                        <p>
                            Tổng tiền:{" "}
                            {item.totalAmount?.toLocaleString("vi-VN")} đ
                        </p>
                        <p>
                            VAT:{" "}
                            {item.totalVatAmount?.toLocaleString("vi-VN")} đ
                        </p>
                    </div>
                ))}
            </div>
            {reportDetails.length > 0 && (
                <div style={{width: "100%", overflowX: "auto", marginTop: 40}}>
                    <h6>Biểu đồ năm {params.year}</h6>
                    {reportBy === 'totalAmount' &&
                        <Checkbox
                            checked={deductVat}
                            onChange={(e) => {
                                handleDeductVatChange(e.target.checked)
                            }}
                        >
                            Có khấu trừ VAT
                        </Checkbox>
                    }
                    <ChartSection
                        reportDetails={!deductVat ? reportDetails : reportDetailsHasVAT}
                        reportBy={reportBy}
                    />
                </div>
            )}
        </>
    );
};

export default Home;
