package com.rental.shop.models;

import com.fasterxml.jackson.annotation.*;
import com.rental.shop.dto.status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

@Getter
@Setter
@Entity
@DynamicUpdate
@Builder(toBuilder = true)
@Table(name="rent_Details")
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class Rent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(insertable=false, updatable=false)
    @JsonIgnore
    private Integer id;

    @Column(name="month")
    @JsonProperty("Month")
    private String month;

    @Column(name = "shop_id")
    @JsonProperty("RentId")
    private Integer shopId;

    @Column(name="name")
    @JsonProperty("Name")
    private String name;

    @Column(name="paid_date")
    @JsonProperty("Paid Date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private String paidDate;

    @Column(name="amt_paid")
    @JsonProperty("Amount Paid")
    private Integer amtPaid;

    @Column(name="status")
    @JsonProperty("Status")
    private status Status;

    @Column(name="amt_left")
    @JsonProperty("Amount Left")
    private Integer amtLeft;

    @ManyToOne(targetEntity = User.class, cascade = CascadeType.DETACH)
    @JoinColumn(name="User_id")
    @JsonIgnore
    private User user;


}
