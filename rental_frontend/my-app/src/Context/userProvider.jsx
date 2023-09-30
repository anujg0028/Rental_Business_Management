import React, { useEffect, useState } from 'react'
import { UserContext } from './userContext'

function UserProvider({ children }) {

  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const [selectedMonth1, setSelectedMonth1] = useState(currentMonth);
  const [shopValue, setShopValue] = useState(1);
  const [addE, setAddE] = useState(false);
  let year = currentMonth.slice(0, 4);
  const [yearE, setYearE] = useState(year);

  const updatedYearE = (year) => {
    setYearE(year);
  }

  const updateSelectedMonth = (month) => {
    setSelectedMonth1(month);
  };

  const updateAddElectric = (value) => {
    setAddE(value);
  }

  const updateShopId = (id) => {
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
    AddElectric: {
      AddE: addE,
      updateE: updateAddElectric
    },
    YearE: {
      yearE: yearE,
      updateYearE: updatedYearE
    },
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider