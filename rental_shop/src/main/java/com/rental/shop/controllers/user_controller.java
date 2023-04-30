package com.rental.shop.controllers;

import com.rental.shop.dto.request.userDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.models.PageReq;
import com.rental.shop.models.User;
import com.rental.shop.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.text.ParseException;

@RestController
@RequestMapping("/user")
public class user_controller {

    @Autowired
    UserService userservice;

    @PostMapping("/create")
    public ResponseEntity<Response> saveChatlog(@RequestBody User reqUser) {
        return userservice.saveUser(reqUser);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Response> getAllUser(){
        return userservice.getAllUser();
    }

    @GetMapping("/getById/{Id}")
    public ResponseEntity<Response> getById(@PathVariable(value="Id")Integer Id){
        return userservice.getUserById(Id);
    }

    @GetMapping("/getUserByPage")
    public ResponseEntity<Response> getUserByPage(@RequestBody PageReq pageReq){
        return userservice.getUserByPage(pageReq);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<Response> updateUser(@RequestBody userDto userdto) throws ParseException {
        return userservice.updateUser(userdto);
    }

    @DeleteMapping("/deleteUser/{Id}")
    public ResponseEntity<Response> deleteUser(@PathVariable(value="Id")Integer id){
        return userservice.deleteUser(id);
    }

    @GetMapping("/UnPaidById/{id}")
    public ResponseEntity<Response> unpaidById(@PathVariable(value="id")Integer id){
        return userservice.UnpaidById(id);
    }

    @GetMapping("/AllUnPaid")
    public ResponseEntity<Response> Allunpaid(){
        return userservice.AllUnpaid();
    }


}
