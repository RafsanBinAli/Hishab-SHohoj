import { Modal, Button } from "react-bootstrap";
import "./MessageModal.css";

const MessageModal = ({ show, onHide, title, message, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="custom-modal">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="custom-modal-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">{message}</Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button className="cancel-btn" onClick={onHide}>
          Cancel
        </Button>
        <Button className="confirm-btn" onClick={onConfirm}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
