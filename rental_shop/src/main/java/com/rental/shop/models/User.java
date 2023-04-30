package com.rental.shop.models;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@DynamicUpdate
@Builder(toBuilder = true)
@Table(name="user_Details")
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "rent_id",updatable=false)
    @JsonProperty("RentId")
    private Integer rent_id;

    @Column(name="name")
    @JsonProperty("Name")
    private String name;

    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @JsonProperty("Start Date")
    private Date startDate;

    @Column(name="rent_per_month")
    @JsonProperty("Rent/M")
    private Integer rentPerMonth;

    @Column(name="advanced_kiraya")
    @JsonProperty("Advanced-Kiraya")
    private Integer advanced_kiraya;

    @Column(name="advanced")
    @JsonProperty("Advanced")
    private Integer advanced;

    @Column(name="phn_number")
    @JsonProperty("Phone No")
    private Long phnNo;

    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @JsonProperty("Bond End Date")
    private String contractEndDt;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private List<Rent> rentResponseList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private List<Electricity> electricityResponseList;


}
