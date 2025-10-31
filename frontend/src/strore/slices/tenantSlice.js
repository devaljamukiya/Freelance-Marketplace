import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

// const API = 'http://localhost:3000'


//get all tenant
export const getAllTenants = createAsyncThunk(
    "tenant/getAllTenants",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("master/tenant");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch tenants" });
        }
    }
);

//create tenant
export const createTenant = createAsyncThunk('tenant/tenant',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post(`master/tenant`, data)
            console.log("✅ Tenant API Response:", response.data);
            return response.data
        }
        catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || { message: 'tenant creation failed' })
        }
    }
)

const tenantSlice = createSlice({
    name: 'tenant',
    initialState: {
        tenant: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        message: null,
        error: null,
    },
    reducers: {
        resetTenantState: (state) => {
            state.tenant = null
            state.status = 'idle'
            state.message = null
            state.error = null

        },
    },

    extraReducers: (builder) => {
        builder
            //create tenant
            .addCase(createTenant.pending, (state) => {
                state.status = 'loading'
                state.error = null
                state.message = null
            })
            .addCase(createTenant.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.error = null
                state.message = action.payload.message || 'Tenant created successfully. Verification code sent.'
                console.log("deep")
            })
            .addCase(createTenant.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload?.message || 'Tenant creation failed.'
                console.log("de")
            })
            //get all tenant
            .addCase(getAllTenants.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllTenants.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tenants = action.payload.tenants || [];
                state.message = action.payload.message || "Tenants fetched successfully";
            })
            .addCase(getAllTenants.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to fetch tenants";
            });
    }

})

export const { resetTenantState } = tenantSlice.actions
export default tenantSlice.reducer