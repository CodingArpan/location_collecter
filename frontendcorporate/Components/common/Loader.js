import React from 'react'

export default function Loader() {
  
    return (
        <>
        <div className="blur"></div>
            <div className="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <style jsx>{`
.blur{
position:fixed;
  width:100%;
  height:100vh;
  background-color:white;
  opacity:0.8;
  z-index: 998;

}

    .loading{
        position: fixed;
        top: 50%;
        left: 50%;
        height: 40px;
        width: 40px;
        transform: translate(-50%, -50%) rotate(45deg) translate3d(0,0,0);
        animation: animate 1.2s ease-in-out infinite;
        z-index: 999;
  

      }
      @keyframes animate {
        0%, 10%, 100%{
          height: 40px;
          width: 40px;
        }
        65%{
          height: 70px;
          width: 70px;
        }
      }
      span{
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        animation: rotate 1.2s linear both infinite;
      }
      @keyframes rotate {
        0%, 30%{
          transform: rotate(0);
        }
        65%{
          transform: rotate(-40deg);
        }
      }
      span:nth-child(1){
        top: 0;
        left: 0;
      
        background: #ffc21a;
      }
      span:nth-child(2){
        top: 0;
        right: 0;
      
        background: #ee4197;
      }
      span:nth-child(3){
        bottom: 0;
        left: 0;
      
        background: #2596ff;
      }
      span:nth-child(4){
        bottom: 0;
        right: 0;
      
        background: #4f0ee6;
      }
      

    `}</style>



        </>
    )
}
