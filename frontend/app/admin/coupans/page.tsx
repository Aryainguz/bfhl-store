'use client';

import AdminLayout from '@/components/admin/admin-layout';
import CouponFormDialog from '@/components/admin/CouapanFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCouponStore } from '@/hooks/useCoupanStore';
import { useEffect, useState } from 'react';

export default function AdminCouponsTable() {
  const { coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon, checkCoupon } = useCouponStore()
  const { toast } = useToast()

  const [checkingCode, setCheckingCode] = useState('')
  const [checkResult, setCheckResult] = useState<{ valid: boolean; discountAmount: number; message?: string } | null>(null)

  // load on mount
  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const handleCreate = async (data: any) => {
    try {
      await createCoupon(data)
      toast({ title: 'Coupon created' })
    } catch (err: any) {
      toast({ variant: 'error', title: 'Error', description: err.message })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return 
    try {
      await deleteCoupon(id)
      toast({ title: 'Coupon deleted' })
    } catch (err: any) {
      toast({ variant: 'error', title: 'Error', description: err.message })
    }
  }

  const handleCheck = async () => {
    setCheckResult(null)
    try {
      const result = await checkCoupon(checkingCode, 1000)
      setCheckResult(result)
    } catch (err: any) {
      toast({ variant: 'error', title: 'Error', description: err.message })
    }
  }

  return (
     <AdminLayout>
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Coupons</h1>
        <CouponFormDialog onSubmit={handleCreate}>
          <Button>Create Coupon</Button>
        </CouponFormDialog>
      </div>

      <div className="flex space-x-2 items-center">
        <Input
          placeholder="Code to validate"
          value={checkingCode}
          onChange={(e) => setCheckingCode(e.target.value)}
        />
        <Button onClick={handleCheck}>Validate</Button>
        {checkResult && (
          <span className={checkResult.valid ? 'text-green-600' : 'text-red-600'}>
            {checkResult.valid
              ? `Valid! You save ₹${checkResult.discountAmount}`
              : checkResult.message}
          </span>
        )}
      </div>

      <Separator />

      {loading && <p>Loading coupons…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {['Code', 'Discount', 'Expires At', 'Min Order', 'Max Uses', 'Used', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-sm font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((c: any) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-2">{c.code}</td>
                <td className="px-4 py-2">₹{c.discountAmount}</td>
                <td className="px-4 py-2">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{c.minOrderValue ?? '—'}</td>
                <td className="px-4 py-2">{c.maxUses ?? '∞'}</td>
                <td className="px-4 py-2">{c.usedCount}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id!)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </AdminLayout>
  )
}
