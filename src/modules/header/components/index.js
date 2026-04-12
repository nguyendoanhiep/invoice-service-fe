import React from 'react';
import { Layout} from 'antd';
import logo from '../../../env/img/logo.png'


const {Header} = Layout;

const HeaderC = () => {

    return (
        <Header className='container' style={{
            marginBottom: '40px',
            height: 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
        }}>
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 38,
                    fontWeight: 300, // 👈 mảnh
                    letterSpacing: '4px', // 👈 tạo độ "premium"
                    color: '#1f1f1f'
                }}
            >
                Invoice Integration
            </div>
        </Header>
    )
}
export default HeaderC;
