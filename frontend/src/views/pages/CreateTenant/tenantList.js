import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTenants } from "../../../strore/slices/tenantSlice";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

const TenantList = () => {
  const dispatch = useDispatch();
  const { tenants, status, error } = useSelector((state) => state.tenant);

  useEffect(() => {
    dispatch(getAllTenants());
  }, [dispatch]);

  if (status === "loading") return <p>Loading tenants...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <CTable striped hover responsive>
      <CTableHead color="dark">
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Company Name</CTableHeaderCell>
          <CTableHeaderCell>Owner Email</CTableHeaderCell>
          <CTableHeaderCell>Plan</CTableHeaderCell>
          <CTableHeaderCell>Price</CTableHeaderCell>
          <CTableHeaderCell>Duration (Days)</CTableHeaderCell>
          <CTableHeaderCell>User Limit</CTableHeaderCell>
          <CTableHeaderCell>Features</CTableHeaderCell>
          <CTableHeaderCell>Verified</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {tenants?.map((tenant, index) => (
          <CTableRow key={tenant.id}>
            <CTableHeaderCell>{index + 1}</CTableHeaderCell>
            <CTableDataCell>{tenant.companyName}</CTableDataCell>
            <CTableDataCell>{tenant.email}</CTableDataCell>
            <CTableDataCell>{tenant.plan?.name || "-"}</CTableDataCell>
            <CTableDataCell>{tenant.plan?.price || "-"}</CTableDataCell>
            <CTableDataCell>{tenant.plan?.durationInDay || "-"}</CTableDataCell>
            <CTableDataCell>{tenant.plan?.userLimit || "-"}</CTableDataCell>
            <CTableDataCell>{tenant.plan?.features || "-"}</CTableDataCell>
            <CTableDataCell>
              {tenant.isVerified ? (
                <CBadge color="success">True</CBadge>
              ) : (
                <CBadge color="danger">False</CBadge>
              )}
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default TenantList;
