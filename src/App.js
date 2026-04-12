import './App.css';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderC from "./modules/header/components"
import Footer from "./modules/footer/components"
import "react-bootstrap"
import "bootstrap-4-react"
import Navigation from "./modules/navigation/components";
import RouterMain from "./router/RouterMain";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";


function App() {
    const location = useLocation();
    useEffect(() => {
    }, [location])
    return (
        <div className="app">
            <HeaderC/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>

                <div style={{width: '18%'}}>
                    <Navigation/>
                </div>
                <div style={{
                    width:'81%',
                    padding: 30,
                    backgroundColor: "#f5f7fb",
                    borderRadius: 10
                }}>
                    <RouterMain/>
                </div>
            </div>
            <Footer/>
            <ToastContainer/>
        </div>
    )
}

export default App;
