package com.rental.shop.repositorys;

import com.rental.shop.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface UserRepo extends PagingAndSortingRepository<User,Integer>, JpaRepository<User,Integer> {
}
