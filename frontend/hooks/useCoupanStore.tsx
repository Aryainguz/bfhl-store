import { Coupon, CouponFormData } from '@/types'
import { create } from 'zustand'

const API = process.env.NEXT_PUBLIC_API_URL

type CouponState = {
  coupons: Coupon[]
  loading: boolean
  error: string | null
  fetchCoupons: () => Promise<void>
  createCoupon: (data: CouponFormData) => Promise<void>
  deleteCoupon: (id: string) => Promise<void>
  checkCoupon: (code: string, subtotal: number) => Promise<any>
}

export const useCouponStore = create<CouponState>((set:any, get:any) => ({
  coupons: [],
  loading: false,
  error: null,

  fetchCoupons: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API}/coupons`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load coupons')
      const data: Coupon[] = await res.json()
      set({ coupons: data })
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  createCoupon: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Create failed')
      }
      // refill list
      await get().fetchCoupons()
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API}/coupons/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      // remove locally for instant UI update
      set((state:any) => ({
        coupons: state.coupons.filter((c:any) => c._id !== id),
      }))
    } catch (err: any) {
      set({ error: err.message })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  checkCoupon: async (code, subtotal) => {
    const res = await fetch(`${API}/coupons/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, subtotal }),
    })
    if (!res.ok) throw new Error('Check failed')
    return res.json() as Promise<any>
  },
}))
