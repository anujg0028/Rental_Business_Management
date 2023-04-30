package com.rental.shop.mapper;

import com.rental.shop.dto.response.RentRes.rentByIdRes;
import com.rental.shop.dto.response.RentRes.rentResponse;
import com.rental.shop.models.Rent;

import java.util.List;

public class RentMapper {

    public static rentResponse mapToRentRes(Rent rent) {
        return rentResponse.builder()
                .amtPaid(rent.getAmtPaid())
                .paidDate(rent.getPaidDate())
                .Status(rent.getStatus())
                .amtLeft(rent.getAmtLeft())
                .month(rent.getMonth())
                .build();
    }

    public static rentByIdRes mapToRentByIdRes(String name, List<rentResponse> rentRes)
    {
        return rentByIdRes.builder()
                .name(name)
                .rentResponseList(rentRes)
                .build();
    }
}
