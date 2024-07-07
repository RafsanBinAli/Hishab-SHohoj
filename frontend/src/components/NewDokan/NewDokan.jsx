import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import "./NewDokan.css";

const DokanForm = () => {
  const [dokanDetails, setDokanDetails] = useState({
    name: "",
    address: "",
    number: "",
  });
  const [itemDetails, setItemDetails] = useState({
    item: "",
    quantity: "",
    price: "",
    seller: "",
  });
  const [itemsList, setItemsList] = useState([]);

  const handleDokanChange = (e) => {
    const { name, value } = e.target;
    setDokanDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const addItem = () => {
    setItemsList((prevList) => [...prevList, itemDetails]);
    setItemDetails({
      item: "",
      quantity: "",
      price: "",
      seller: "",
    });
  };

  const deleteItem = (index) => {
    setItemsList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const saveDokan = () => {
    console.log({
      ...dokanDetails,
      items: itemsList,
    });
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <div className="dokan-form-container">
            <h3 className="dokan-form-heading">Add New Dokan</h3>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={dokanDetails.name}
                  onChange={handleDokanChange}
                />
              </Form.Group>

              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  name="address"
                  value={dokanDetails.address}
                  onChange={handleDokanChange}
                />
              </Form.Group>

              <Form.Group controlId="formNumber">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter number"
                  name="number"
                  value={dokanDetails.number}
                  onChange={handleDokanChange}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group controlId="formItem">
                    <Form.Label>Item</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="item"
                      value={itemDetails.item}
                      onChange={handleItemChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="quantity"
                      value={itemDetails.quantity}
                      onChange={handleItemChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="price"
                      value={itemDetails.price}
                      onChange={handleItemChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formSeller">
                    <Form.Label>Seller</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="seller"
                      value={itemDetails.seller}
                      onChange={handleItemChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="primary"
                onClick={addItem}
                className="add-item-button"
              >
                Add
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={6}>
          <div className="dokan-details-container">
            <h3 className="dokan-details-heading">Dokan Details</h3>
            <p>
              <strong>Name:</strong> {dokanDetails.name}
            </p>
            <p>
              <strong>Address:</strong> {dokanDetails.address}
            </p>
            <p>
              <strong>Number:</strong> {dokanDetails.number}
            </p>

            <Table striped bordered hover className="dokan-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.seller}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => deleteItem(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button
              variant="success"
              onClick={saveDokan}
              className="save-button"
            >
              Save
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DokanForm;
