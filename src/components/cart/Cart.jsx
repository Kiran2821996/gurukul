import React, { useState, useRef, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ShoppingCartIcon, CreditCardIcon, DocumentTextIcon } from '@heroicons/react/24/solid'

import { clearLocalStorage } from '../../redux/cartSlice';

import { useSelector, useDispatch } from 'react-redux';

import OrderSummary from './OrderSummary';

export default function Cart() {
    const [open, setOpen] = useState(false)
    const [openpd, setOpenpd] = useState(false)
    const [openpg, setOpenpg] = useState(false)

    const cancelButtonRef = useRef(null)

    const cart = useSelector((state) => state.cart)
    const dispatch = useDispatch();

    const getTotalQuantity = () => {
        let total = 0
        cart.forEach(item => {
            total += item.quantity
        })
        return total
    }

    const getTotal = () => {
        let totalQuantity = 0
        let totalPrice = 0
        cart.forEach(item => {
            totalQuantity += item.quantity
            totalPrice += item.price * item.quantity
        })
        return { totalPrice, totalQuantity }
    }

    const handleCheckout = () => {
        setOpen(false)
        setOpenpd(true)
    }
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        confirmEmail: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        mobile: '',
        email: '',
        confirmEmail: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const validateForm = (data) => {
        let errors = {};

        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!data.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(data.mobile)) {
            errors.mobile = 'Invalid mobile number';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Invalid email address';
        }

        if (!data.confirmEmail.trim()) {
            errors.confirmEmail = 'Confirm email is required';
        } else if (data.email !== data.confirmEmail) {
            errors.confirmEmail = 'Emails do not match';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(formData);
        if (Object.keys(errors).length === 0) {
            setOpen(false);
            setOpenpd(false);
            setOpenpg(true);
            console.log('Form submitted:', formData);
        } else {
            setFormErrors(errors);
        }
    };


    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    const handleClearLocalStorage = () => {
        dispatch(clearLocalStorage());
        window.location.reload();
        setOpenpg(false)
    };

    return (
        <>
            <div onClick={() => setOpen(true)}
                className="relative right-cust cursor-pointer"
            >
                <ShoppingCartIcon className="w-6 h-5 md:w-12 md:h-11 lg:w-12 lg:h-11 text-amber-500 hover:text-white" />
                <p className='absolute text-amber-500 font-black text-sm right-0 -top-2 lg:text-lg lg:-top-3 rounded-full lg:-right-1'>{getTotalQuantity() || 0}</p>
            </div>
            {/* Shopping cart dialogue */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                                <Dialog.Title as="h3" className=" flex items-center text-base lg:text-2xl font-semibold leading-6 text-gray-900">
                                                    ORDER SUMMARY <div
                                                        className="relative  cursor-pointer"
                                                    >
                                                        <ShoppingCartIcon className="w-6 h-5 md:w-12 md:h-11 lg:w-12 lg:h-11 text-amber-500 hover:text-white" />
                                                        <p className='absolute text-amber-500 font-black text-sm right-0 -top-2 lg:text-lg lg:-top-3 rounded-full lg:-right-1'>{getTotalQuantity() || 0}</p>
                                                    </div>
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    {cart.length > 0 ?
                                                        <table className="table-auto w-full">
                                                            <thead>
                                                                <tr className='border-collapse '>
                                                                    <th className='text-left'>Course Name</th>
                                                                    <th className='text-center'>Quantity</th>
                                                                    <th className='text-center'>Price</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {cart?.map((item) => (
                                                                    <OrderSummary
                                                                        key={item._id}
                                                                        id={item._id}
                                                                        title={item.title}
                                                                        price={item.price}
                                                                        quantity={item.quantity}
                                                                    />
                                                                ))}
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <th className='text-left pt-4 pb-1 text-lg lg:text-xl'>Totals</th>
                                                                    <td className='text-center pt-4 pb-1 text-md lg:text-lg'>{getTotal().totalQuantity}Nos</td>
                                                                    <td className='text-center pt-4 pb-1 font-bold text-lg lg:text-xl'>₹{getTotal().totalPrice}/-</td>
                                                                    <td></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table> :
                                                        <p className='text-center text-md lg:text-xl text-gray-500'>No Items in the cart</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        {cart.length > 0 ?
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-md font-semibold text-amber-500 shadow-sm hover:bg-amber-500 hover:text-white sm:ml-3 sm:w-auto"
                                                onClick={() => handleCheckout()}
                                            >
                                                PROCEED TO CHECKOUT
                                            </button> :
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-md font-semibold text-amber-500 shadow-sm hover:bg-amber-500 hover:text-white sm:ml-3 sm:w-auto"
                                                onClick={() => setOpen(false)}
                                            >
                                                OK
                                            </button>}
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* Payment dialogue */}
            <Transition.Root show={openpd} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenpd}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                                <Dialog.Title as="h3" className=" flex items-center text-base lg:text-2xl font-semibold leading-6 text-gray-900">
                                                    PAYMENT <CreditCardIcon className="w-6 h-5 md:w-12 md:h-11 lg:w-12 lg:h-11 text-amber-500 " />
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-md lg:text-xl text-gray-500">
                                                        Payment link will be only shared via respective mail id in order to verify and the link will be shared for the same mail once payment done successfully.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-2 px-4 lg:px-6 gap-x-4">
                                            <div className='mt-3'>
                                                <label htmlFor="name" className="sr-only">
                                                    Name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    autoComplete="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="min-w-0 w-full bg-grey-cust flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                                                    placeholder="Enter your name"
                                                />
                                                {formErrors.name && (
                                                    <p className="text-red-500">{formErrors.name}</p>
                                                )}
                                            </div>
                                            <div className='mt-3'>

                                                <label htmlFor="mobile" className="sr-only">
                                                    Mobile Number
                                                </label>
                                                <input
                                                    id="mobile"
                                                    name="mobile"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="min-w-0 w-full bg-grey-cust flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                                                    placeholder="Enter your mobile number"
                                                />
                                                {formErrors.mobile && (
                                                    <p className="text-red-500">{formErrors.mobile}</p>
                                                )}
                                            </div>
                                            <div className='mt-3'>
                                                <label htmlFor="email" className="sr-only">
                                                    Email address
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="min-w-0 w-full bg-grey-cust flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                                                    placeholder="Enter your email"
                                                />
                                                {formErrors.email && (
                                                    <p className="text-red-500">{formErrors.email}</p>
                                                )}
                                            </div>
                                            <div className='mt-3'>
                                                <label htmlFor="confirmEmail" className="sr-only">
                                                    Confirm Email address
                                                </label>
                                                <input
                                                    id="confirmEmail"
                                                    name="confirmEmail"
                                                    type="email"
                                                    autoComplete="email"
                                                    value={formData.confirmEmail}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="min-w-0 w-full bg-grey-cust flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                                                    placeholder="Confirm your email"
                                                />
                                                {formErrors.confirmEmail && (
                                                    <p className="text-red-500">{formErrors.confirmEmail}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-md font-semibold text-amber-500 shadow-sm hover:bg-amber-500 hover:text-white sm:ml-3 sm:w-auto"
                                            >
                                                SHARE PAYMENT LINK VIA MAIL
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setOpenpd(false)}
                                                ref={cancelButtonRef}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {/*Guidline dialogue */}
            <Transition.Root show={openpg} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenpg}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                                <Dialog.Title as="h3" className=" flex items-center text-base lg:text-2xl font-semibold leading-6 text-gray-900">
                                                    GUIDELINE <DocumentTextIcon className="w-6 h-5 md:w-12 md:h-11 lg:w-12 lg:h-11 text-amber-500 " />
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-md lg:text-xl text-gray-500">
                                                        We've sent the payment link to the email you provided. Upon completion of payment, the video links for your selected courses will be swiftly shared with the same email. In case you don't find it in your inbox, kindly check your spam mail. For any inquiries, reach out to us at <span className='text-black'>xxxx@gmail.com. </span>
                                                    </p>
                                                    <p className="text-md lg:text-xl text-gray-500 mt-3">We appreciate your patronage! Enjoy learning!</p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-md font-semibold text-amber-500 shadow-sm hover:bg-amber-500 hover:text-white sm:ml-3 sm:w-auto"
                                            onClick={handleClearLocalStorage}
                                        >
                                            OK
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>

    )
}
