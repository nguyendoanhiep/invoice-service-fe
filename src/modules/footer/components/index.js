import React from "react";
import '../../../App.css'

const Footer = () => {
    return (
        <div className="mastfoot pb-5 bg-white section-padding pb-0">
            <div className="inner container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="footer-widget pr-lg-5 pr-0">
                            <p>
                                Invoice Integration là hệ thống tự động đồng bộ đơn hàng,
                                xuất hoá đơn điện tử và theo dõi trạng thái xử lý theo thời gian thực.
                                Hệ thống được thiết kế tối giản, ổn định và phù hợp cho vận hành độc lập.
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="footer-widget px-lg-5 px-0">
                            <h4>Automatic Jobs</h4>
                            <ul className="list-unstyled open-hours">
                                <li className="d-flex justify-content-between">
                                    <span>Mỗi ngày :</span>
                                    <span>23:59</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span>Rà soát lại vào :</span>
                                    <span>00:30</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span>Các giờ trong ngày :</span>
                                    <span>Minute 55</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="footer-widget pl-lg-5 pl-0">
                            <h4>System Notes</h4>
                            <p>
                                Mọi lịch sử xử lý, lỗi phát sinh và trạng thái job đều được
                                lưu lại để đối soát và hỗ trợ khi cần thiết.
                                Trường hợp có sự cố, vui lòng cung cấp thông tin lỗi hiển thị trên hệ thống.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-12 d-flex align-items-center">
                        <p className="mx-auto text-center mb-0">
                            © 2026 Invoice Integration System — Automated Order & Invoice Processing
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Footer;
