import React from 'react'
import { removeItem } from '../../redux/cartSlice'
import { useDispatch } from 'react-redux'

import { TrashIcon } from '@heroicons/react/24/solid'

export default function OrderSummary({id, price, title, quantity = 0 }) {

    const dispatch = useDispatch()
    return (
        
            <tr key={id} className='border-collapse border-b-2 border-b-solid border-gray-300'>
                <td className='text-left pt-4 pb-1 text-md lg:text-lg'>{title}</td>
                <td className='text-center pt-4 pb-1 text-md lg:text-lg'>{quantity}</td>
                <td className='text-center pt-4 pb-1 text-md lg:text-lg'>₹{price}</td>
                <td className='text-right pt-4 pb-1'><TrashIcon onClick={() => dispatch(removeItem(id))} className="h-4 w-4 ms-3 cursor-pointer" /> </td>
            </tr>
      
    )
}
