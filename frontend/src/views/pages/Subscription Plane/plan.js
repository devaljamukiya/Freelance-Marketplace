import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPlanes,
  createPlane,
  updatePlane,
  deletePlane,
} from "../../../strore/slices/planeSlice";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
} from "@coreui/react";

const PlaneList = () => {
  const dispatch = useDispatch();
  const { planes, status, error } = useSelector((state) => state.planes);

  // modal states
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    durationInDay: "",
    userLimit: "",
    features: "",
  });

  useEffect(() => {
    dispatch(getAllPlanes());
  }, [dispatch]);

  // handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // open modal for create
  const handleCreate = () => {
    setEditMode(false);
    setFormData({
      id: "",
      name: "",
      price: "",
      durationInDay: "",
      userLimit: "",
      features: "",
    });
    setVisible(true);
  };

  // open modal for edit
  const handleEdit = (plane) => {
    setEditMode(true);
    setFormData(plane);
    setVisible(true);
  };

  // delete plane
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this plane?")) {
      dispatch(deletePlane(id)).then(() => dispatch(getAllPlanes()));
    }
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      dispatch(updatePlane(formData)).then(() => {
        setVisible(false);
        dispatch(getAllPlanes());
      });
    } else {
      dispatch(createPlane(formData)).then(() => {
        setVisible(false);
        dispatch(getAllPlanes());
      });
    }
  };

  if (status === "loading") return <p>Loading plans...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Plane Management</h4>
        <CButton color="primary" onClick={handleCreate}>
          + Create Plane
        </CButton>
      </div>

      <CTable striped hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>Duration (Days)</CTableHeaderCell>
            <CTableHeaderCell>User Limit</CTableHeaderCell>
            <CTableHeaderCell>Features</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {planes?.map((plane, index) => (
            <CTableRow key={plane.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableDataCell>{plane.name}</CTableDataCell>
              <CTableDataCell>{plane.price}</CTableDataCell>
              <CTableDataCell>{plane.durationInDay}</CTableDataCell>
              <CTableDataCell>{plane.userLimit}</CTableDataCell>
              <CTableDataCell>{plane.features}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(plane)}
                >
                  Edit
                </CButton>
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(plane.id)}
                >
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for create/edit */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? "Edit Plane" : "Create Plane"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              className="mb-3"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <CFormInput
              className="mb-3"
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <CFormInput
              className="mb-3"
              label="Duration (Days)"
              name="durationInDay"
              type="number"
              value={formData.durationInDay}
              onChange={handleChange}
              required
            />
            <CFormInput
              className="mb-3"
              label="User Limit"
              name="userLimit"
              type="number"
              value={formData.userLimit}
              onChange={handleChange}
            />
            <CFormInput
              className="mb-3"
              label="Features"
              name="features"
              value={formData.features}
              onChange={handleChange}
            />
            <CButton color="primary" type="submit">
              {editMode ? "Update" : "Create"}
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PlaneList;
