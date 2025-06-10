import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  value2: number;
}

const initialState: CounterState = {
  value: 0,
  value2: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number >) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
  extraReducers: (builder) => { 
    builder
      .addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.value += action.payload;
        state.value2 += action.payload * 2;
      })
      .addCase(incrementAsync.pending, () => {
        console.log("Increment async is pending");
      })
  }
})

export const incrementAsync = createAsyncThunk(
  "counter/incrementAsync",
  async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return amount;
  }
)

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

export default counterSlice.reducer;