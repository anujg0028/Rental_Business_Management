import React, { useContext } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';

export default class PieChart extends React.Component {
    
    render() {

        const user = this.props.user
        let state;
        if(user.UnpaidRent == '')state = {
            labels: ['Paid','Unpaid', 'Halfpaid'],
            datasets: [
                {
                    label: 'Rent',
                    backgroundColor: [
                        '#B21F00',
                        '#C9DE00',
                        '#2FDE00',
                    ],
                    hoverBackgroundColor: [
                        '#501800',
                        '#4B5000',
                        '#175000',
                    ],
                    // data: [user.UnpaidRent, user.HalfpaidRent]
                    data : [0,0,0]
                },
                {
                    label: 'Electricity',
                    backgroundColor: [
                        'blue',
                        'purple',
                        'brown',
                    ],
                    hoverBackgroundColor: [
                        'blue',
                        'purple',
                        'brown',
                    ],
                    // data: [user.UnpaidElec, user.HalfpaidElec]
                    data : [0,0,0]
                }
            ]
        }
        else state = {
            labels: ['Paid','Unpaid', 'Halfpaid'],
            datasets: [
                {
                    label: 'Rent',
                    backgroundColor: [
                        '#B21F00',
                        '#C9DE00',
                        '#2FDE00',
                    ],
                    hoverBackgroundColor: [
                        '#501800',
                        '#4B5000',
                        '#175000',
                    ],
                    data: [user.PaidRent,user.UnpaidRent, user.HalfpaidRent]
                    //data : [0,0]
                },
                {
                    label: 'Electricity',
                    backgroundColor: [
                        'blue',
                        'purple',
                        'brown',
                    ],
                    hoverBackgroundColor: [
                        'blue',
                        'purple',
                        'brown',
                    ],
                    data: [user.PaidElec,user.UnpaidElec, user.HalfpaidElec]
                    //data : [0,0]
                }
            ]
        }
        
        return (
            <div>
                {/* <Pie
                    data={state}
                    options={{
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                /> */}
                <p className='mt-2' style={{marginLeft:'20px' , fontWeight : '500', color:'grey'}}>Amount Collection</p>
                <div style={{height:'340px', marginLeft:'20px'}}>
                    <Doughnut
                        data={state}
                        options={{
                            title: {
                                display: false,
                                text: 'Anuj',
                                fontSize: 13
                            },
                            legend: {
                                display: false,
                                position: 'top',
                                fontSize: 10
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}