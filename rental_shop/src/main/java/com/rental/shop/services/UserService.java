package com.rental.shop.services;

import com.rental.shop.dto.request.userDto;
import com.rental.shop.dto.response.Response;
import com.rental.shop.models.PageReq;
import com.rental.shop.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.text.ParseException;


@Service
public interface UserService {

    public ResponseEntity<Response> saveUser(User reqUser);

    public ResponseEntity<Response> getAllUser();

    public ResponseEntity<Response> getUserById(Integer id);

    public ResponseEntity<Response> updateUser(userDto userdto) throws ParseException;

    public ResponseEntity<Response> deleteUser(Integer id);

    public ResponseEntity<Response> getUserByPage(PageReq pageReq);

    public ResponseEntity<Response> UnpaidById(Integer id);

    public ResponseEntity<Response> AllUnpaid();

    public User rentHelper(Integer id);

    public User electricHelper(Integer id);



}
