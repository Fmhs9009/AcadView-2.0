import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
}

export const userDetailsSlice = createSlice({
  name: 'user_details',
  initialState,
  reducers: {
    setUserDetail: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserDetail } = userDetailsSlice.actions

export default userDetailsSlice.reducer