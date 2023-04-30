package com.rental.shop.dto.response;

import com.rental.shop.dto.response.ElectricRes.ElectricResponse;
import com.rental.shop.dto.response.RentRes.rentResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class userResponse {

    private Integer rentId;

    private String name;

    private List<rentResponse> rentResponseList;

    private List<ElectricResponse> electricResponseList;
}
