package com.rental.shop.controllers;

import com.rental.shop.dto.request.ElectricUpdateDto;
import com.rental.shop.dto.request.electricDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.models.Electricity;
import com.rental.shop.services.ElectricityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.text.ParseException;


@RestController
@RequestMapping("/electricity")
public class electricity_controller {

    @Autowired
    ElectricityService electricityService;

    @PostMapping("/create")
    public ResponseEntity<Response> saveElectric(@RequestBody electricDto electricReq) throws ParseException {
        return electricityService.saveElectric(electricReq);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Response> getAllElectric(){
        return electricityService.getAllElectric();
    }

    @GetMapping("/getById/{Id}")
    public ResponseEntity<Response> getElectricById(@PathVariable(value="Id") Integer id){
        return electricityService.getElectricById(id);
    }

    @PutMapping("/updateElectric")
    public ResponseEntity<Response> updateElectric(@RequestBody ElectricUpdateDto electricdto){
        return electricityService.updateElectric(electricdto);
    }

    @DeleteMapping("/deleteElectric/{Id}/{month}")
    public ResponseEntity<Response> deleteById(@PathVariable(value="Id")Integer id,@PathVariable(value="month")String month){
        return electricityService.deleteById(id,month);
    }

    @PostMapping("/default")
    public ResponseEntity<Response> saveElectric(@RequestBody Electricity electricReq) {
        return electricityService.saveElect(electricReq);
    }

}
