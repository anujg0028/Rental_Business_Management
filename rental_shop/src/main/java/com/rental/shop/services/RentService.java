package com.rental.shop.services;

import com.rental.shop.dto.request.RentUpdateDto;
import com.rental.shop.dto.request.rentDto;
import com.rental.shop.dto.response.RentRes.rentResponse;
import com.rental.shop.dto.response.Response;
import com.rental.shop.models.Rent;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.text.ParseException;
import java.util.List;


@Service
public interface RentService {

    public ResponseEntity<Response> saveRent(rentDto rentReq) throws ParseException;

    public ResponseEntity<Response> getAllRent();

    public ResponseEntity<Response> getRentById(Integer id);

    public ResponseEntity<Response> updateRent(RentUpdateDto rentdto);

    public ResponseEntity<Response> deleteById(Integer id,String month);

    public ResponseEntity<Response> createDefault(Rent rent);

}
