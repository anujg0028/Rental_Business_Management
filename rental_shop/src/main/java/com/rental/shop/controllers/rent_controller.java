package com.rental.shop.controllers;

import com.rental.shop.dto.request.RentUpdateDto;
import com.rental.shop.dto.request.rentDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.models.Rent;
import com.rental.shop.services.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.text.ParseException;

@RestController
@RequestMapping("/rent")
public class rent_controller {

    @Autowired
    RentService rentService;

    @PostMapping("/create")
    public ResponseEntity<Response> saveRent(@RequestBody rentDto rentReq) throws ParseException {
        return rentService.saveRent(rentReq);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Response> getAllRent(){
        return rentService.getAllRent();
    }

    @GetMapping("/getById/{Id}")
    public ResponseEntity<Response> getRentById(@PathVariable(value="Id") Integer id){
        return rentService.getRentById(id);
    }

    @PutMapping("/updateRent")
    public ResponseEntity<Response> updateRent(@RequestBody RentUpdateDto rentdto){
        return rentService.updateRent(rentdto);
    }

    @DeleteMapping("/deleteRent/{Id}/{month}")
    public ResponseEntity<Response> deleteById(@PathVariable(value="Id")Integer id,@PathVariable(value="month")String month){
        return rentService.deleteById(id,month);
    }

    @PostMapping("/default")
    public ResponseEntity<Response> saveDefaultRent(@RequestBody Rent rentReq) {
        return rentService.createDefault(rentReq);
    }

}
