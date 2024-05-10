import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cart.findIndex((item) => item._id === action.payload._id);
      if (itemIndex !== -1) {
        state.cart.splice(itemIndex, 1);
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item.quantity === 1) {
        item.quantity = 1
      } else {
        item.quantity--;
      }
    },
    removeItem: (state, action) => {
      const removeItem = state.cart.filter((item) => item._id !== action.payload);
      state.cart = removeItem;
    },
    clearLocalStorage: () => {
        storage.removeItem('persist:root'); 
      },
  },
});

export const cartReducer = cartSlice.reducer;
export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  clearLocalStorage
} = cartSlice.actions;