import React from "react";

export default function Svg_Slider(){
    const svgs =[
        "public/images/Amazon_Web_Services-Logo.wine.svg",
        "public/images/Cisco_Systems-Logo.wine.svg",
        "public/images/Oracle_Database-Logo.wine.svg"
    ];

    return(
        // <div>
        //     {svgs.map((svg, index) =>(
        //         <img key={index} src={svg} alt="" className="h-6 w-6"/>
        //     ))}
        // </div>
        svgs
    );
}