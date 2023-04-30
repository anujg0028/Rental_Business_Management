package com.rental.shop.dto.response.ElectricRes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class electricByIdRes {

    private String name;
    private List<ElectricResponse> ElectricResponseList;
}
