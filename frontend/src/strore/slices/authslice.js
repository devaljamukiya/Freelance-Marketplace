// src/redux/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import api from '../../api/axiosInstance';

// const API = 'http://localhost:3000'

export const login = createAsyncThunk('auth/', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post(`master/`, data)
    console.log(response);
    
    if (response.data.token) localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Login failed' })
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Login failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
