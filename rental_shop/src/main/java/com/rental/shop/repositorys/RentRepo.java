package com.rental.shop.repositorys;

import com.rental.shop.models.Rent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import java.util.List;
import java.util.Optional;

public interface RentRepo extends PagingAndSortingRepository<Rent, Integer>, JpaRepository<Rent, Integer> {

    List<Rent> findByShopId(Integer id);

    Optional<Rent> findByShopIdAndMonth(Integer Id, String month);

    void deleteByShopId(Integer id);

    void deleteByShopIdAndMonth(Integer id,String month);

}
