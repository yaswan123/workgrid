import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch groups (GET request to /user/getGrp/:userId)
export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://work-grid.vercel.app/user/getGrp/${userId}`)
      return Array.isArray(response.data) ? response.data : [response.data]; // Ensure response is always an array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch groups");
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "groups/fetchTasks",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://work-grid.vercel.app/group/getTasks/${groupId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
)

// Edit group (PUT request to /groups/edit/:id)
export const editGroupAsync = createAsyncThunk(
  "groups/editGroup",
  async ({ id, updatedGroup }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://work-grid.vercel.app/group/edit/${id}`, updatedGroup);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update group");
    }
  }
);

const initialState = {
  groups: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearGroups: (state) => {
      state.groups = [];
      state.status = "idle";
      state.error = null;
    },
    editGroup: (state, action) => {
      const { id, updatedGroup } = action.payload;
      const index = state.groups.findIndex((group) => group._id === id);
      if (index !== -1) {
        state.groups[index] = { ...state.groups[index], ...updatedGroup };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = [...action.payload];
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editGroupAsync.fulfilled, (state, action) => {
        const index = state.groups.findIndex((group) => group._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = {
            ...state.groups[index],
            title: action.payload.title,
            description: action.payload.description
          }
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.groups = action.payload
      })
  },
});

export const { clearGroups, editGroup } = groupSlice.actions;
export default groupSlice.reducer;
