import React from 'react'

function YearSelector({ selectedYear, onChange }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 2 }, (_, index) => currentYear - index);
  
    return (
      <select value={selectedYear} onChange={onChange} style={{width:'80px', height:'30px', cursor: 'pointer'}}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    );
  }

export default YearSelector