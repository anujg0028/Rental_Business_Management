package com.rental.shop.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Data
@AllArgsConstructor
public class WholeRentDto {

    private Integer RentId;
    private Integer ElectricAmtPaid;
    private Integer RentAmtPaid;
    private String Month;

}
