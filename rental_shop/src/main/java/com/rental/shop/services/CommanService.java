package com.rental.shop.services;

import com.rental.shop.dto.request.WholeRentDto;
import com.rental.shop.dto.response.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface CommanService {

    public ResponseEntity<Response> UpdateWhole(WholeRentDto wholeRentDto);
}
