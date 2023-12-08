import { Card, Col, Row } from "antd";
import React, { useRef, useState, Suspense } from "react";
import './portofolio.css'
import img1 from '../../../resource/img/img1.png';
import img2 from '../../../resource/img/img2.png';
import img3 from '../../../resource/img/img3.png';
import img4 from '../../../resource/img/img4.png';
import img5 from '../../../resource/img/img5.png';
import img6 from '../../../resource/img/img6.png';
import img7 from '../../../resource/img/img7.png';
import img8 from '../../../resource/img/img8.png';
import img9 from '../../../resource/img/img9.png';
import img10 from '../../../resource/img/img10.png';
import "antd/dist/antd.css"

const Portofolio = () => {
    const { Meta } = Card;
    const [portofolios, setPorto] = useState([
        {
            id: "p1",
            page: [{
                id: img1,
            },
            {
                id: img2,
            },
            {
                id: img3,
            },
            {
                id: img4,
            }],
        },
        {
            id: "p2",
            page: [{
                id: img5,
            },
            {
                id: img6,
            },
            {
                id: img7,
            },
            {
                id: img8,
            }],
        },
        {
            id: "p3",
            page: [{
                id: img9,
            },
            {
                id: img10,
            },
            {
                id: "null",
            },
            {
                id: "null",
            }],
        },
        {
            id: "p4",
            page: [{
                id: "1",
            },
            {
                id: "2",
            },
            {
                id: "3",
            },
            {
                id: "4",
            }],
        },
    ]);

    return (
        <div>
            <div className="portofolio-container">
                {/* {portofolios.map((porto, i) => {
                    return (
                        <Card key={i} hoverable className="card-portofolio">
                            {porto.page.map((xxx, i) => {
                                return (
                                    <Card.Grid key={i} className="card-grid" >
                                        {<img className="portofolio-image" alt="example" src={xxx.id} />}
                                    </Card.Grid>
                                )
                            })}
                        </Card>
                    );
                })} */}
            </div>
        </div>
    );
};

export default Portofolio;
