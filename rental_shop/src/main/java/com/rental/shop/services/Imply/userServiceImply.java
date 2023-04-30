package com.rental.shop.services.Imply;

import com.rental.shop.constants.MessageConstants;
import com.rental.shop.dto.request.userDto;
import com.rental.shop.dto.response.AllUnpaid;
import com.rental.shop.dto.response.ElectricRes.ElectricResponse;
import com.rental.shop.dto.response.RentRes.rentResponse;
import com.rental.shop.dto.response.Response;
import com.rental.shop.dto.response.userResponse;
import com.rental.shop.dto.status;
import com.rental.shop.mapper.ElectricMapper;
import com.rental.shop.mapper.RentMapper;
import com.rental.shop.mapper.UserMapper;
import com.rental.shop.models.Electricity;
import com.rental.shop.models.PageReq;
import com.rental.shop.models.Rent;
import com.rental.shop.models.User;
import com.rental.shop.repositorys.ElectricRepo;
import com.rental.shop.repositorys.RentRepo;
import com.rental.shop.repositorys.UserRepo;
import com.rental.shop.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.text.ParseException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class userServiceImply implements UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    RentRepo rentRepo;

    @Autowired
    ElectricRepo electricRepo;

    @Override
    public ResponseEntity<Response> saveUser(User reqUser) {

        try {
            userRepo.save(reqUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response(String.format(MessageConstants.USER_CREATED_SUCCESS,reqUser.getRent_id())));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> getAllUser() {

        try {
            List<User> user = userRepo.findAll();
            if(user.isEmpty())return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.NOT_FOUND));
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(user));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }

    }

    @Override
    public ResponseEntity<Response> getUserById(Integer id) {

        try {
            User user = userRepo.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,id)));
            } else {
                Pageable pageable = PageRequest.of(1, 5);
                Page<rentResponse> rentResponsePage = PageableExecutionUtils.getPage(user.getRentResponseList().stream().map(RentMapper::mapToRentRes)
                        .sorted(Comparator.comparing(rentResponse::getMonth))
                        .collect(Collectors.toList()), pageable, () -> rentRepo.count());
                Page<ElectricResponse> electricResponsePage = PageableExecutionUtils.getPage(user.getElectricityResponseList().stream().map(ElectricMapper::mapToElectricRes)
                        .sorted(Comparator.comparing(ElectricResponse::getMonth))
                        .collect(Collectors.toList()), pageable, () -> electricRepo.count());
                userResponse userResponse = UserMapper.mapToUserResponse(user, rentResponsePage.getContent(), electricResponsePage.getContent());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(userResponse));
            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> updateUser(userDto userdto) throws ParseException {

        try {
            User user = userRepo.findById(userdto.getId()).orElse(null);
            if (user != null) {
                if (!userdto.getRentPermonth().describeConstable().isEmpty())
                    user.setRentPerMonth(userdto.getRentPermonth());
                if (!userdto.getContractEndDt().isEmpty()) user.setContractEndDt(userdto.getContractEndDt());
                userRepo.save(user);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(user));
            } else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,userdto.getId())));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Transactional
    @Override
    public ResponseEntity<Response> deleteUser(Integer id) {

        try {
            userRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(String.format(MessageConstants.USER_DELETE_SUCCESS,id)));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> getUserByPage(PageReq pageReq) {

        try {
            User user = userRepo.findById(pageReq.getId()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,pageReq.getId())));
            } else {
                Pageable pageable = PageRequest.of(pageReq.getPageNo(), pageReq.getLimit());
                Page<rentResponse> rentResponsePage = PageableExecutionUtils.getPage(user.getRentResponseList().stream().map(RentMapper::mapToRentRes).collect(Collectors.toList()), pageable, () -> rentRepo.count());
                Page<ElectricResponse> electricResponsePage = PageableExecutionUtils.getPage(user.getElectricityResponseList().stream().map(ElectricMapper::mapToElectricRes).collect(Collectors.toList()), pageable, () -> electricRepo.count());
                userResponse userResponse = UserMapper.mapToUserResponse(user, rentResponsePage.getContent(), electricResponsePage.getContent());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(userResponse));
            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> UnpaidById(Integer id) {

        try {
            User user = userRepo.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(String.format(MessageConstants.NOT_FOUND_USER,id)));
            } else {
                List<rentResponse> rentResponseList=rentRepo.findByShopId(user.getRent_id()).stream()
                        .map(RentMapper::mapToRentRes)
                        .filter(rent -> rent.getStatus()== status.HALFPAID || rent.getStatus()==status.UNPAID)
                        .sorted(Comparator.comparing(rentResponse::getMonth))
                        .collect(Collectors.toList());

                List<ElectricResponse> electricResponses=electricRepo.findByShopId(user.getRent_id()).stream()
                        .map(ElectricMapper::mapToElectricRes)
                        .filter(electricity -> electricity.getStatus()==status.UNPAID || electricity.getStatus()==status.HALFPAID)
                        .sorted(Comparator.comparing(ElectricResponse::getMonth))
                        .collect(Collectors.toList());

                if(electricResponses.isEmpty() && rentResponseList.isEmpty())return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response("No.Unpaid.Entry.Present"));

                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(UserMapper.mapToUserResponse(user,rentResponseList,electricResponses)));
            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response(MessageConstants.ERROR+e));
        }
    }

    @Override
    public ResponseEntity<Response> AllUnpaid() {
        try{

            List<Rent> rentResponseList= rentRepo.findAll().stream()
                    .filter(rent -> rent.getStatus() == status.HALFPAID || rent.getStatus() == status.UNPAID)
                    .sorted(Comparator.comparing(Rent::getMonth)).toList();

            List<Electricity> electricResponsesList= electricRepo.findAll().stream()
                    .filter(electricity -> electricity.getStatus() == status.UNPAID || electricity.getStatus() == status.HALFPAID)
                    .sorted(Comparator.comparing(Electricity::getMonth)).toList();

            if(rentResponseList.isEmpty()&&electricResponsesList.isEmpty())return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response("No.Unpaid.Entry.Present"));

            AllUnpaid unpaid=new AllUnpaid(rentResponseList,electricResponsesList);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Response(unpaid));
        }
        catch(Exception e){
            return null;
        }
    }

    @Override
    public User rentHelper(Integer id) {

        try {
            User user = userRepo.findById(id).orElse(null);
            if (user != null) {
                return user;
            } else return null;
        }
        catch(Exception e){
            return null;
        }
    }

    @Override
    public User electricHelper(Integer id) {

        try {
            User user = userRepo.findById(id).orElse(null);
            return user;
        }
        catch(Exception e){
            return null;
        }
    }



}
