import React from 'react'
import './loader.css'

const Loader = () => {
    return (
        // <div className="loading">
        //     <div></div>
        // </div>
        <div className="loading">
            <div className="loader-wrapper">
                <div className="loader">
                    <div className="loader loader-inner"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader