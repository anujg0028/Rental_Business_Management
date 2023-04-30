package com.rental.shop.dto.response.RentRes;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.rental.shop.dto.status;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class rentResponse {

    private String paidDate;

    private Integer amtPaid;

    private status Status;

    private Integer amtLeft;

    private String month;
}
