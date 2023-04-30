package com.rental.shop.mapper;

import com.rental.shop.dto.response.ElectricRes.ElectricResponse;
import com.rental.shop.dto.response.RentRes.rentResponse;
import com.rental.shop.dto.response.userResponse;
import com.rental.shop.models.User;
import java.util.List;

public class UserMapper {

    public static userResponse mapToUserResponse(User user, List<rentResponse> rentResponses, List<ElectricResponse> electricResponses)
    {
        return userResponse.builder()
                .rentId(user.getRent_id())
                .name(user.getName())
                .rentResponseList(rentResponses)
                .electricResponseList(electricResponses)
                .build();
    }
}
