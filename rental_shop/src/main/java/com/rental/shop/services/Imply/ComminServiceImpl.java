package com.rental.shop.services.Imply;

import com.rental.shop.constants.MessageConstants;
import com.rental.shop.dto.request.ElectricUpdateDto;
import com.rental.shop.dto.request.RentUpdateDto;
import com.rental.shop.dto.request.WholeRentDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.services.CommanService;
import com.rental.shop.services.ElectricityService;
import com.rental.shop.services.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
public class ComminServiceImpl implements CommanService{

    @Autowired
    RentService rentService;

    @Autowired
    ElectricityService electricityService;
    @Override
    public ResponseEntity<Response> UpdateWhole(WholeRentDto wholeRentDto) {

        try {
            String mth;
            if (wholeRentDto.getMonth().equals("")) {
                Month currentMonth = Month.values()[java.time.LocalDate.now().getMonthValue() - 1];
                String month = currentMonth.getDisplayName(TextStyle.FULL, Locale.getDefault());
                mth = month;
            } else mth = wholeRentDto.getMonth();
            RentUpdateDto rentdto = new RentUpdateDto(wholeRentDto.getRentId(), wholeRentDto.getRentAmtPaid(), mth);
            ElectricUpdateDto electricUpdateDto = new ElectricUpdateDto(wholeRentDto.getRentId(), mth, wholeRentDto.getElectricAmtPaid());
            rentService.updateRent(rentdto);
            electricityService.updateElectric(electricUpdateDto);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(String.format(MessageConstants.WHOLE_RENT, wholeRentDto.getRentId())));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }
}
