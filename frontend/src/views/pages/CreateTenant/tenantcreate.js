import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createTenant, resetTenantState } from '../../../strore/slices/tenantSlice'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilBuilding, cilEnvelopeClosed, cilCreditCard } from '@coreui/icons'

const TenantRegister = () => {
  const dispatch = useDispatch()
  const { status, message, error } = useSelector((state) => state.tenant)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      companyName: '',
      planId: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      companyName: Yup.string().required('Company name is required'),
      planId: Yup.string().required('Please select a plan'),
    }),
    onSubmit: async (values) => {
      await dispatch(createTenant(values))
    },
  })

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 shadow">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h2 className="mb-3">Tenant Registration</h2>
                    <p className="text-body-secondary">Register your company to get started</p>

                    {message && <CAlert color="success">{message}</CAlert>}
                    {error && <CAlert color="danger">{error}</CAlert>}

                    {/* Fields */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.name && !!formik.errors.name}
                      />
                    </CInputGroup>
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-danger mb-2">{formik.errors.name}</div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.email && !!formik.errors.email}
                      />
                    </CInputGroup>
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger mb-2">{formik.errors.email}</div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilBuilding} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.companyName && !!formik.errors.companyName}
                      />
                    </CInputGroup>
                    {formik.touched.companyName && formik.errors.companyName && (
                      <div className="text-danger mb-2">{formik.errors.companyName}</div>
                    )}

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilCreditCard} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="planId"
                        placeholder="Plan ID (e.g., 1)"
                        value={formik.values.planId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.planId && !!formik.errors.planId}
                      />
                    </CInputGroup>
                    {formik.touched.planId && formik.errors.planId && (
                      <div className="text-danger mb-2">{formik.errors.planId}</div>
                    )}

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          color="primary"
                          className="px-4"
                          disabled={status === 'loading'}
                        >
                          {status === 'loading' ? 'Creating...' : 'Register Tenant'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default TenantRegister
