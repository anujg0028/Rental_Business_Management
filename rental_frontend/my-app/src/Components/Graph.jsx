import React from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
Chart.register(CategoryScale);

const options = {
    scales: {
        x: {
            type: 'category', // Explicitly set the scale type to 'category'
            title: {
                display: true,
                text: 'Months',
                font: { size: 14 }
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Electricity',
                font: { size: 13 }
            },
            title: {
                display: true,
                text: 'Rent',
                font: { size: 13 }
            },
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'top'
        }
    }
};


export default class Graph extends React.Component {
    render() {

        const rent = this.props.rent;
        const electricity = this.props.electricity;

        let labelR = [];
        let dataR = [], dataE = [];
        if(rent!=null && electricity!=null)
        {
            for (let i in rent) {
                labelR.push(i);
                dataR.push(rent[i]);
            }
            for (let i in electricity) {
                dataE.push(electricity[i]);
            }
        }

        let data;
        if (rent == null && electricity == null) {
            data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Electricity',
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        borderWidth: 2,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    },
                    {
                        label: 'Rent',
                        backgroundColor: 'brown',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        borderWidth: 2,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    }
                ]
            };
        }
        else {
            data = {
                labels: labelR,
                datasets: [
                    {
                        label: 'Electricity',
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        borderWidth: 2,
                        data: dataE,
                    },
                    {
                        label: 'Rent',
                        backgroundColor: 'brown',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        borderWidth: 2,
                        data: dataR,
                    }
                ]
            };
        }

        return (
            <div className='mt-2'>
                <p style={{ marginLeft: '20px', fontWeight: '500', color: 'grey' }}>Yearly Amount Collection</p>
                <Bar data={data} options={options} />
            </div>
        );
    }
}