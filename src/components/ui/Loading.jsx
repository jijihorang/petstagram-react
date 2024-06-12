import React from "react";
import Spinner from "../../assets/loading.gif";
import "./Loading.css";

const Loading = () => {
    return (
        <div className="loading-overlay"> 
            <div className="loading-content">
                <h2>기다려 멍!</h2>
                <img src={Spinner} alt="로딩" width="10%" className="loading-img"/>
            </div>
        </div>
    );
};

export default Loading;
