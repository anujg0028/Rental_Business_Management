package com.rental.shop.repositorys;

import com.rental.shop.models.Electricity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import java.util.List;
import java.util.Optional;

public interface ElectricRepo extends PagingAndSortingRepository<Electricity, Integer>, JpaRepository<Electricity, Integer> {

    Optional<Electricity> findByShopIdAndMonth(Integer Id, String month);

    List<Electricity> findByShopId(Integer id);
    void deleteByShopId(Integer id);

    void deleteByShopIdAndMonth(Integer id,String month);

}
