package com.rental.shop.controllers;

import com.rental.shop.dto.request.WholeRentDto;
import com.rental.shop.dto.request.electricDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.services.CommanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/common")
public class CommonController {

    @Autowired
    CommanService commanService;

    @PutMapping("/updateAll")
    public ResponseEntity<Response> saveElectric(@RequestBody WholeRentDto wholeRentDto){
        return commanService.UpdateWhole(wholeRentDto);
    }
}
