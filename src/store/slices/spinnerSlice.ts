import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SpinnerState {
  isVisible: boolean;
  message?: string;
}

const initialState: SpinnerState = {
  isVisible: false,
  message: undefined,
};

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    showSpinner: (state, action: PayloadAction<string | undefined>) => {
      state.isVisible = true;
      state.message = action.payload;
    },
    hideSpinner: (state) => {
      state.isVisible = false;
      state.message = undefined;
    },
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
