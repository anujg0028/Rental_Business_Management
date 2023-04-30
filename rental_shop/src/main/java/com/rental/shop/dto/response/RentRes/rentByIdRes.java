package com.rental.shop.dto.response.RentRes;

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
public class rentByIdRes {

    private String name;
    private List<rentResponse> rentResponseList;
}
