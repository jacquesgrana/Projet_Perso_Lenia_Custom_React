//import React from 'react';
import { Outlet } from 'react-router-dom';
//import logo from './../logo.svg';
import Footer from './template/Footer';
import Header from './template/Header';
import { useRef, useState } from 'react';
import CustomToast from './common/CustomToast';
import IToast from '../interface/IToast';

function App() {
  const [showToast, setShowToast] = useState(false);
  const outletProps = {
    displayToast: (toast: IToast ) => displayToast(toast)
  };

  const toastRef = useRef<IToast>( //IToast
    {
        title: "Test",
        subtitle: "Test",
        message: "Test display toast",
        mode: "success",
        delay: 2000
    }
  );

  const toggleShowToast = () => setShowToast(!showToast);

  const displayToast = (toast: IToast) => {
    toastRef.current = toast;
    toggleShowToast();
  }

  return (
    <div className="App"  id="container_all">
        <Header />
        <main id="main">
          <Outlet context={outletProps}/>
        </main>
        <Footer />
        <CustomToast
          show={showToast}
          toast={toastRef.current}
          toggleShow={toggleShowToast}
        />
    </div>
  );
  
}

export default App;

/*
        <CustomToast
                show={showToast}
                toast={toastRef.current}
                toggleShow={toggleShowToast}
        />
*/