package com.rental.shop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RentUpdateDto {

    private Integer rentId;

    private Integer amtPaid;

    private String month;
}
