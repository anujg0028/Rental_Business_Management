package com.rental.shop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ElectricUpdateDto {

    private Integer rentId;

    private String month;

    private Integer amtPaid;
}
