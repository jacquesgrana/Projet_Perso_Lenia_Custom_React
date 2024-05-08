//import React from 'react';
import { Outlet } from 'react-router-dom';
//import logo from './../logo.svg';
import Footer from './template/Footer';
import Header from './template/Header';
import { useRef, useState } from 'react';
import CustomToast from './common/CustomToast';
import IToast from '../interface/IToast';
//import './../scss/App.scss';

function App() {
  const [showToast, setShowToast] = useState(false);
  const outletProps = {
    displayToast: (toast: IToast ) => displayToast(toast) //IToast
  };

  const toastRef = useRef<IToast>( //IToast
    {
        title: "Test.",
        subtitle: "Test.",
        message: "Test d'affichage d'un toast.",
        mode: "success"
    }
  );

  const toggleShowToast = () => setShowToast(!showToast);

  const displayToast = (toast: IToast) => { //IToast
    toastRef.current = toast;
    toggleShowToast();
  }

  //console.log('toggleShowToast :', toggleShowToast);

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