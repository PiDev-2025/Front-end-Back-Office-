import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import img7 from "../../../assets/images/product/img-7.png";
import img4 from "../../../assets/images/product/img-4.png";

const ParkingDetails = (props) => {
  const { isOpen, toggle, transaction = {} } = props;

  return (
    <Modal isOpen={isOpen} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabIndex="-1" toggle={toggle}>
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Order Details</ModalHeader>
        <ModalBody>
          <p className="mb-2">
            Product id: <span className="text-primary">{transaction?.orderId || "#SK2540"}</span>
          </p>
          <p className="mb-4">
            Billing Name: <span className="text-primary">{transaction?.billingName || "Neal Matthews"}</span>
          </p>

          <div className="table-responsive">
            <Table className="table align-middle table-nowrap">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><img src={img7} alt="" className="avatar-sm" /></td>
                  <td>Wireless Headphone (Black)</td>
                  <td>$ 225</td>
                </tr>
                <tr>
                  <td><img src={img4} alt="" className="avatar-sm" /></td>
                  <td>Hoodie (Blue)</td>
                  <td>$ 145</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

EcommerceOrdersModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};

export default ParkingDetails;