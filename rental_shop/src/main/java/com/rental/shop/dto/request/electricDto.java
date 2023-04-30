package com.rental.shop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class electricDto {

    private Integer rentId;

    private String currReading;

    private Integer amtPaid;
}
