import React from 'react'
import { Card, CardBody, Form, Label, Input, Container, Button } from "reactstrap";

export default function DropDownBar() {

    return (
        <>
            <Input
                type="select"
                id="category"
                placeholder="Enter Here"
                className="rounded-0"
                style={{ width: '160px' }}
                name="categoryId"
                // onChange={fieldChange}
                defaultValue={0}
            >
                <option value={0}>Select Category</option>
                <option value={1}>
                    Rent
                </option>
                <option value={2}>
                    Electricity
                </option>
            </Input>
        </>
    )
}
