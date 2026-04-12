import React, {useEffect, useMemo, useRef} from "react";
import {Mix} from "@ant-design/plots";

const ChartSection = React.memo(({ reportDetails, reportBy}) => {
    console.log(reportBy)
    const totalByMonth = useMemo(() => {
        return reportDetails.reduce((acc, item) => {
            const month = String(item.month);
            acc[month] = (acc[month] || 0) + (item[reportBy] || 0);
            return acc;
        }, {});
    }, [reportDetails, reportBy]);

    const maxValue = useMemo(() => {
        const columnMax = Math.max(
            ...reportDetails.map(item => item[reportBy] || 0)
        );

        const lineMax = Math.max(
            ...Object.values(totalByMonth)
        );
        return Math.max(columnMax, lineMax);

    }, [reportDetails, reportBy, totalByMonth]);

    const minChartWidth = useMemo(() => {
        if (!reportDetails?.length) return 800;

        // đếm số source khác nhau
        const uniqueSources = new Set(
            reportDetails.map(item => item.source)
        );

        const columnWidth = 60; // 🔥 mỗi cột 40px
        const monthCount = 12;

        const widthPerMonth = uniqueSources.size * columnWidth;
        return  Math.max(monthCount * widthPerMonth, 1200);
    }, [reportDetails]);

    const config = useMemo(() => ({
        legend: {
            position: "top-left",
        },
        autoFit: false,
        padding: [30, 30, 30, 47],
        // top, right, bottom, left
        syncViewPadding: true,
        plots: [
            {
                type: "column",
                options: {
                    appendPadding: 0,
                    data: reportDetails
                        .map(item => ({
                            ...item,
                            month: String(item.month),
                        })),
                    xField: "month",
                    yField: reportBy,   // 🔥 động
                    seriesField: "source",
                    isGroup: true,
                    maxColumnWidth: 50,   // 🔥 QUAN TRỌNG
                    annotations: Object.keys(totalByMonth).map((month) => ({
                        type: "text",
                        position: [month, totalByMonth[month]],
                        content:
                            reportBy === "totalAmount"
                                ? totalByMonth[month].toLocaleString("vi-VN")
                                : totalByMonth[month],
                        offsetY: -12,
                        style: {
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: 450,
                            fill: "#000",
                        },
                        autoAdjust: false,
                    })),

                    xAxis: {
                        type: "cat",
                        title: {text: "Tháng"},
                    },

                    yAxis: {
                        title: {
                            text:
                                reportBy === "totalAmount"
                                    ? "Tổng tiền"
                                    : "Tổng đơn",
                        },
                        min: 0,
                        tickCount: 10
                    },
                    meta: {
                        [reportBy]: {
                            min: 0,
                            max: maxValue,
                            nice: false,
                        },
                        month: {
                            type: "cat",
                            values: ["1","2","3","4","5","6","7","8","9","10","11","12"],
                        }
                    }
                },
            },
            {
                type: "line",
                options: {
                    meta: {
                        [reportBy]: {
                            min: 0,
                            max: maxValue,
                            nice: false,   // QUAN TRỌNG
                        }
                    },
                    appendPadding: 0,
                    data: Array.from({length: 12}, (_, i) => {
                        const month = String(i + 1);
                        return {
                            month,
                            [reportBy]: totalByMonth[month] || 0,
                        };
                    }),
                    yAxis: {
                        title: {
                            text:
                                reportBy === "totalAmount"
                                    ? "Tổng tiền"
                                    : "Tổng đơn",
                        },
                        min: 0,
                        tickCount: 10
                    },
                    xField: "month",
                    yField: reportBy,   // 🔥 động
                    smooth: true,
                    color:
                        reportBy === "totalAmount"
                            ? "#ff4d4f"
                            : "#52c41a",

                    lineStyle: {lineWidth: 1},
                    point: {size: 3},
                },
            },
        ]
    }), [reportDetails, reportBy, totalByMonth]);

    const calculateTotalByMonth = (filteredData, valueField) => {
        return filteredData.reduce((acc, item) => {
            const month = item.month;
            const amount = item[valueField] || 0;
            acc[month] = (acc[month] || 0) + amount;
            return acc;
        }, {});
    };

    const updateLine = (plot, valueField) => {
        const columnView = plot.chart.views[0];
        const filteredData = columnView.getData();
        const totalByMonth = calculateTotalByMonth(filteredData, valueField);

        const newLineData = Array.from({length: 12}, (_, i) => {
            const month = String(i + 1);
            return {
                month,
                [valueField]: totalByMonth[month] || 0,
            };
        });

        const lineView = plot.chart.views[1]; // 🔥 FIX CỐ ĐỊNH

        lineView.changeData(newLineData);
    };

    const updateAnnotations = (plot, valueField) => {
        console.log(valueField)
        const columnView = plot.chart.views[0];
        const filteredData = columnView.getData();

        const totalByMonth = filteredData.reduce((acc, item) => {
            const month = item.month;
            const amount = item[valueField] || 0;
            acc[month] = (acc[month] || 0) + amount;
            return acc;
        }, {});
        // ❗ Clear annotation của COLUMN VIEW
        columnView.annotation().clear(true);

        Object.keys(totalByMonth).forEach((month) => {
            const value = totalByMonth[month];
            if (!value) return;
            columnView.annotation().text({
                position: [month, value],
                offsetY: -12,
                content: value.toLocaleString("vi-VN"),
                style: {
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 500,
                },
            });
        });

        plot.chart.render();
    };
    const isUpdatingRef = useRef(false);
    const reportByRef = useRef(reportBy);

    useEffect(() => {
        reportByRef.current = reportBy;
    }, [reportBy]);
    const handleReady = (plot) => {
        const refresh = () => {
            if (isUpdatingRef.current) return;
            isUpdatingRef.current = true;

            updateAnnotations(plot, reportByRef.current);
            updateLine(plot, reportByRef.current);

            isUpdatingRef.current = false;
        };

        refresh();

        plot.chart.on('legend-item:click', () => {
            setTimeout(() => {
                refresh();
            }, 0);
        });
    };


    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <Mix
                height={600}
                width={minChartWidth}   // 🔥 QUAN TRỌNG
                {...config}
                onReady={(plot) => {
                    handleReady(plot);
                }}
            />
        </div>
    );
});
export default ChartSection;