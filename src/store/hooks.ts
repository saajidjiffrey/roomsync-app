import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Use these instead of plain `useDispatch` and `useSelector`
// Because of this we dont need to import RootState and AppDispatch in every component
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector