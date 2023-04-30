package com.rental.shop.services.Imply;

import com.rental.shop.constants.MessageConstants;
import com.rental.shop.dto.request.RentUpdateDto;
import com.rental.shop.dto.request.rentDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.dto.response.RentRes.rentResponse;
import com.rental.shop.dto.status;
import com.rental.shop.mapper.RentMapper;
import com.rental.shop.models.Rent;
import com.rental.shop.models.User;
import com.rental.shop.repositorys.RentRepo;
import com.rental.shop.repositorys.UserRepo;
import com.rental.shop.services.RentService;
import com.rental.shop.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class rentServiceImply implements RentService {

    @Autowired
    RentRepo rentRepo;

    @Autowired
    UserService userService;
    @Autowired
    private UserRepo userRepo;

    @Override
    public ResponseEntity<Response> saveRent(rentDto rentReq) throws ParseException {

        try {
            User user = userRepo.findById(rentReq.getRentId()).orElse(null);
            if(user==null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,rentReq.getRentId())));
            Integer amtleft = user.getRentPerMonth() - rentReq.getAmtPaid();
            Month currentMonth = Month.values()[java.time.LocalDate.now().getMonthValue() - 1];
            String month = currentMonth.getDisplayName(TextStyle.FULL, Locale.getDefault());
            status Status;
            if (amtleft == 0) Status = status.PAID;
            else if (rentReq.getAmtPaid() == 0) Status = status.UNPAID;
            else Status = status.HALFPAID;
            Rent rent = Rent.builder()
                    .shopId(rentReq.getRentId())
                    .name(user.getName())
                    .amtLeft(amtleft)
                    .Status(Status)
                    .amtPaid(rentReq.getAmtPaid())
                    .month(month)
                    .paidDate(getCurrentDate())
                    .user(user)
                    .build();
            rentRepo.save(rent);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response(rent));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> getAllRent() {

        try {
            List<Rent> rent = rentRepo.findAll(Sort.by(Sort.Direction.ASC, "month"));
            if (rent.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.NOT_FOUND));
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(rent));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> getRentById(Integer id) {

        try {
            User rent = userService.rentHelper(id);
            if(rent==null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,id)));
            Pageable pageable = PageRequest.of(1, 10);
            Page<rentResponse> rentRes = PageableExecutionUtils.getPage(rentRepo.findByShopId(id).stream().map(RentMapper::mapToRentRes)
                    .sorted(Comparator.comparing(rentResponse::getMonth))
                    .collect(Collectors.toList()), pageable, () -> rentRepo.count());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(RentMapper.mapToRentByIdRes(rent.getName(), rentRes.getContent())));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> updateRent(RentUpdateDto rentdto) {

        try {
            Rent rent = rentRepo.findByShopIdAndMonth(rentdto.getRentId(), rentdto.getMonth()).orElse(null);
            if (rent != null) {
                User userRes = userService.rentHelper(rentdto.getRentId());
                status Status;
                Integer amtPaid = rent.getAmtPaid() + rentdto.getAmtPaid();
                Integer amtleft = userRes.getRentPerMonth() - amtPaid;
                if (amtleft == 0) {
                    Status = status.PAID;
                    amtPaid = userRes.getRentPerMonth();
                } else Status = status.HALFPAID;
                rent.setAmtLeft(amtleft);
                rent.setStatus(Status);
                rent.setAmtPaid(amtPaid);
                rentRepo.save(rent);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(rent));
            } else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,rentdto.getRentId())));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Transactional
    @Override
    public ResponseEntity<Response> deleteById(Integer id,String month) {

        try {
            rentRepo.deleteByShopIdAndMonth(id, month);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(String.format(MessageConstants.RENT_DELETE_SUCCESS,id)));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> createDefault(Rent rent) {

        try {
            User user = userService.electricHelper(rent.getShopId());
            if(user==null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,rent.getShopId())));
            rent.setUser(user);
            rentRepo.save(rent);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response("Rent.Created"));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    public static String getCurrentDate() throws ParseException {

        try {
            Date currentDate = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(currentDate);
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
            String formattedDate = formatter.format(currentDate);
            return formattedDate;
        }
        catch(Exception e){
            return "Error";
        }
    }

}
