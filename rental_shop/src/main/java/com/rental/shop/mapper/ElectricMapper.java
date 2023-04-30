package com.rental.shop.mapper;

import com.rental.shop.dto.response.ElectricRes.ElectricResponse;
import com.rental.shop.dto.response.ElectricRes.electricByIdRes;
import com.rental.shop.models.Electricity;

import java.util.List;

public class ElectricMapper {

    public static ElectricResponse mapToElectricRes(Electricity electricity) {
        return ElectricResponse.builder()
                .currReading(electricity.getCurrReading())
                .pastReading(electricity.getPastReading())
                .unit(electricity.getUnit())
                .amtToBePaid(electricity.getAmtToBePaid())
                .paidDate(electricity.getPaidDate())
                .Status(electricity.getStatus())
                .amtLeft(electricity.getAmtLeft())
                .amtPaid(electricity.getAmtPaid())
                .month(electricity.getMonth())
                .monthLeft(electricity.getMonthLeft())
                .build();
    }

    public static electricByIdRes mapToElecByIdRes(String name, List<ElectricResponse> elecRes)
    {
        return electricByIdRes.builder()
                .name(name)
                .ElectricResponseList(elecRes)
                .build();
    }

}
