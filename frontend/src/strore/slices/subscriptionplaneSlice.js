import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

export const getAllPlanes = createAsyncThunk("master/", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("master/plane");
    return res.data.planes;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// ✅ create new plane
export const createPlane = createAsyncThunk("master/", async (planeData, { rejectWithValue }) => {
  try {
    const res = await axios.post(API_URL, planeData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// ✅ update existing plane
export const updatePlane = createAsyncThunk("planes/update", async (planeData, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/${planeData.id}`, planeData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// ✅ delete plane
export const deletePlane = createAsyncThunk("planes/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const planeSlice = createSlice({
  name: "planes",
  initialState: { planes: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlanes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPlanes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planes = action.payload;
      })
      .addCase(getAllPlanes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createPlane.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(updatePlane.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(deletePlane.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});

export default planeSlice.reducer;
