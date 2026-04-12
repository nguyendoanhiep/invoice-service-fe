import {
    AreaChartOutlined,
    BarChartOutlined, ContainerOutlined,
    DashboardOutlined,
    DollarOutlined, HddOutlined, OrderedListOutlined, SettingOutlined, ShopOutlined
} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();

    function getItem(label, key, icon, children, type, path) {
        return {
            key,
            icon,
            children,
            label,
            type,
            path
        };
    }

    const items = [
        {
            type: 'divider',
        },
        getItem('Báo cáo', '/', <AreaChartOutlined style={{fontSize: 18}}/>),
        getItem('Quản lý Order', '/order', <OrderedListOutlined style={{fontSize: 18}}/>),
        getItem('Quản lý Invoice', '/invoice', <ContainerOutlined style={{fontSize: 18}}/>),
        getItem('Cấu hình Invoice', '/invoice-config', <SettingOutlined style={{fontSize: 18}}/>),
        getItem('Quản lý History', '/history', <HddOutlined style={{fontSize: 18}}/>),
    ];
    const onClick = (item) => {
        if (item && item.keyPath[0]) {
            navigate(item.keyPath[0]);
        }
    };
    return (
        <Menu
            onClick={onClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub2']}
            mode="inline"
            items={items}
        />
    )
}
export default Navigation;