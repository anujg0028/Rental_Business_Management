package com.rental.shop.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageReq {

    private Integer id;

    private Integer limit = 10;

    private Integer pageNo=1;
}
