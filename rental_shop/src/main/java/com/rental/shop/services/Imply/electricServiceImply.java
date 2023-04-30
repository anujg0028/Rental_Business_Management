package com.rental.shop.services.Imply;

import com.rental.shop.constants.MessageConstants;
import com.rental.shop.dto.request.ElectricUpdateDto;
import com.rental.shop.dto.request.electricDto;
import com.rental.shop.dto.response.ElectricRes.ElectricResponse;
import com.rental.shop.dto.response.Response;
import com.rental.shop.dto.status;
import com.rental.shop.mapper.ElectricMapper;
import com.rental.shop.models.Electricity;
import com.rental.shop.models.User;
import com.rental.shop.repositorys.ElectricRepo;
import com.rental.shop.services.ElectricityService;
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
public class electricServiceImply implements ElectricityService {

    @Autowired
    ElectricRepo electricRepo;

    @Autowired
    UserService userService;

    @Override
    public ResponseEntity<Response> saveElectric(electricDto electricReq) throws ParseException {

        try {
            User user = userService.electricHelper(electricReq.getRentId());
            if(user==null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,electricReq.getRentId())));
            System.out.println(electricReq.getCurrReading().equals("L"));
            if(!electricReq.getCurrReading().equals("L"))
            {
                String preReading = user.getElectricityResponseList().get(0).getCurrReading();
                Integer unit = Integer.parseInt(electricReq.getCurrReading()) - Integer.parseInt(preReading);
                Integer amtToBePaid;
                if(electricReq.getRentId()==10||electricReq.getRentId()==11)amtToBePaid=unit*7;
                else amtToBePaid = unit * 15;
                Integer amtleft = electricReq.getAmtPaid() - amtToBePaid;
                Month currentMonth = Month.values()[java.time.LocalDate.now().getMonthValue() - 1];
                String month = currentMonth.getDisplayName(TextStyle.FULL, Locale.getDefault());
                status Status;
                if (amtleft == 0) Status = status.PAID;
                else if (electricReq.getAmtPaid() == 0) Status = status.UNPAID;
                else Status = status.HALFPAID;

                Electricity electricity = Electricity.builder()
                        .shopId(electricReq.getRentId())
                        .name(user.getName())
                        .currReading(electricReq.getCurrReading())
                        .pastReading(preReading)
                        .unit(unit)
                        .amtToBePaid(amtToBePaid)
                        .amtPaid(electricReq.getAmtPaid())
                        .amtLeft(amtleft)
                        .Status(Status)
                        .month(month)
                        .paidDate(getCurrentDate())
                        .user(user)
                        .build();

                electricRepo.save(electricity);
                return ResponseEntity.status(HttpStatus.CREATED).body(new Response(electricity));
            }
            else {
                Electricity elect=user.getElectricityResponseList().get(0);
                Month currentMonth = Month.values()[java.time.LocalDate.now().getMonthValue() - 1];
                String month = currentMonth.getDisplayName(TextStyle.FULL, Locale.getDefault());
                String monthLeft,preReading;
                System.out.println((elect.getMonthLeft().equals(""))+"  +++++");
                if(elect.getMonthLeft().equals("")){
                    monthLeft="Month-1";
                    preReading = elect.getCurrReading();
                }
                else {
                    preReading = elect.getPastReading();
                    String index=elect.getMonthLeft().substring(5);
                    System.out.println(index);
                    if(Character.isDigit(index.charAt(1))&&index.length()==3){
                        int no=Integer.parseInt(String.valueOf(index.charAt(1)+index.charAt(2)))+1;
                        System.out.println(no);
                        monthLeft="Month-"+no;
                    }
                    else {
                        int no=Integer.parseInt(String.valueOf(index.charAt(1)))+1;
                        System.out.println(no);
                        monthLeft="Month-"+no;
                    }
                }
                Electricity electricity = Electricity.builder()
                        .shopId(electricReq.getRentId())
                        .name(user.getName())
                        .currReading(electricReq.getCurrReading())
                        .pastReading(preReading)
                        .unit(0)
                        .amtToBePaid(0)
                        .amtPaid(0)
                        .amtLeft(0)
                        .Status(status.LEFT)
                        .month(month)
                        .paidDate(getCurrentDate())
                        .user(user)
                        .monthLeft(monthLeft)
                        .build();

                electricRepo.save(electricity);
                return ResponseEntity.status(HttpStatus.CREATED).body(new Response(electricity));

            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> getAllElectric() {

        try {
            List<Electricity> electricityList = electricRepo.findAll(Sort.by(Sort.Direction.ASC, "month"));
            if (electricityList.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.NOT_FOUND));
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(electricityList));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> getElectricById(Integer id) {

        try {
            User user = userService.electricHelper(id);
            if(user==null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,id)));
            Pageable pageable = PageRequest.of(1, 10);
            Page<ElectricResponse> electricResponsePage = PageableExecutionUtils.getPage(electricRepo.findByShopId(id).stream().map(ElectricMapper::mapToElectricRes)
                    .sorted(Comparator.comparing(ElectricResponse::getMonth))
                    .collect(Collectors.toList()), pageable, () -> electricRepo.count());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(ElectricMapper.mapToElecByIdRes(user.getName(), electricResponsePage.getContent())));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> updateElectric(ElectricUpdateDto electricdto) {

        try {
            Electricity electricity = electricRepo.findByShopIdAndMonth(electricdto.getRentId(), electricdto.getMonth()).orElse(null);
            if (electricity != null) {
                status Status;
                Integer amtPaid = electricity.getAmtPaid() + electricdto.getAmtPaid();
                Integer amtleft = electricity.getAmtToBePaid() - amtPaid;
                if (amtleft == 0) {
                    Status = status.PAID;
                    amtPaid = electricity.getAmtToBePaid();
                } else Status = status.HALFPAID;
                electricity.setAmtLeft(amtleft);
                electricity.setStatus(Status);
                electricity.setAmtPaid(amtPaid);
                electricRepo.save(electricity);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(electricity));
            } else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.NOT_FOUND));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<Response> deleteById(Integer id, String month) {

        try {
            electricRepo.deleteByShopIdAndMonth(id, month);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(String.format(MessageConstants.ELECTRIC_DELETE_SUCCESS,id)));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> saveElect(Electricity reqElect) {

        try {
            User user = userService.electricHelper(reqElect.getShopId());
            if(user==null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,reqElect.getShopId())));
            Electricity electricity = Electricity.builder()
                    .shopId(reqElect.getShopId())
                    .currReading(reqElect.getCurrReading())
                    .pastReading(reqElect.getPastReading())
                    .unit(reqElect.getUnit())
                    .amtToBePaid(reqElect.getAmtToBePaid())
                    .paidDate(reqElect.getPaidDate())
                    .Status(reqElect.getStatus())
                    .name(user.getName())
                    .amtPaid(reqElect.getAmtPaid())
                    .month(reqElect.getMonth())
                    .monthLeft(reqElect.getMonthLeft())
                    .user(user)
                    .build();

            electricRepo.save(electricity);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response("Electric.Created"));
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
            Date dateOnly = cal.getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
            String formattedDate = formatter.format(currentDate);
            return formattedDate;
        }
        catch(Exception e){
            return "Error";
        }

    }

}
