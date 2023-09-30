import React, { useEffect, useState } from 'react'
import { UserContextR } from './userContext'

function UserProviderR({children}) {

  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const [selectedMonth1, setSelectedMonth1] = useState(currentMonth);
  const [shopValue, setShopValue] = useState(1);
  const [addR,setAddR] = useState(false);
  let year = currentMonth.slice(0, 4);
  const [yearR,setYearR] = useState(year);

  const updateSelectedMonth = (month) => {
    setSelectedMonth1(month);
  };

  const updatedYearR = (year)=>{
    setYearR(year);
  }

  const updateAddR = (value)=>{
    setAddR(value);
  }

  const updateShopId=(id)=>{
    setShopValue(id);
  }

  // Combine the state and functions into a single object to provide to the context
  const contextValue = {
    SelectMonth: {
      month: selectedMonth1,
      updateMonth: updateSelectedMonth,
    },
    SelectedId: {
      Id: shopValue,
      updateId: updateShopId
    },
    AddRent : {
      addRent : addR,
      updateAddRent : updateAddR
    },
    YearR : {
      yearR : yearR,
      updateYearR : updatedYearR
    }
  };

  return (
   <UserContextR.Provider value={contextValue}>
      {children}
   </UserContextR.Provider>
  )
}

export default UserProviderR