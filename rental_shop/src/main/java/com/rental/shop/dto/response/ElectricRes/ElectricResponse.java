package com.rental.shop.dto.response.ElectricRes;

import com.rental.shop.dto.status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class ElectricResponse {

    private String currReading;

    private String pastReading;

    private Integer unit;

    private String paidDate;

    private Integer amtToBePaid;

    private Integer amtPaid;

    private status Status;

    private Integer amtLeft;

    private String monthLeft;

    private String month;
}
