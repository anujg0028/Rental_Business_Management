package com.rental.shop.dto.response;

import com.rental.shop.models.Electricity;
import com.rental.shop.models.Rent;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AllUnpaid {

    private List<Rent> RentList;

    private List<Electricity> ElectricityList;
}
