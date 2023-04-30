package com.rental.shop.services;

import com.rental.shop.dto.request.ElectricUpdateDto;
import com.rental.shop.dto.request.electricDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.models.Electricity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.text.ParseException;

@Service
public interface ElectricityService {

    public ResponseEntity<Response> saveElectric(electricDto electricReq) throws ParseException;

    public ResponseEntity<Response> getAllElectric();

    public ResponseEntity<Response> getElectricById(Integer id);

    public ResponseEntity<Response> updateElectric(ElectricUpdateDto electricdto);

    public ResponseEntity<Response> deleteById(Integer id,String month);

    public ResponseEntity<Response> saveElect(Electricity reqElect);

}
