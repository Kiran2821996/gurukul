import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';

const Card = ({ price, currency, videoId, title, offerPrice, percentage, _id }) => {
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  const isInCart = cart.some(item => item._id === _id);
  console.log(cart,_id);

  return (
    <div className="-mt-2 p-2" id={_id}>
      <div className="rounded-2xl bg-amber-500 pt-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:pt-16">
        <div className="px-8">
          <div>
            <iframe width="100%" height="300px" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
          <p className=" text-2xl lg:text-4xl mt-3 font-semibold text-black">{title}</p>
          <p className="mt-6 flex items-baseline justify-center gap-x-2">
            <span className="text-3xl lg:text-5xl font-bold tracking-tight text-white line-through decoration-black">₹{offerPrice}</span>
            <span className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900">₹{price}</span>
            <span className="text-sm lg:text-md font-semibold leading-6 tracking-wide text-gray-900">{percentage}% OFF</span>
          </p>

          <div className="my-6 flex pb-3 lg:pb-0 items-center justify-center gap-x-6 lg:justify-between">
            <button onClick={() => setOpen(true)}
              className="w-56 border-2 text-center rounded-md bg-transparent px-1 py-2 lg:px-3.5 lg:py-2.5 text-md lg:text-lg font-semibold text-gray-900 shadow-sm border-black hover:text-white hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              READ MORE
            </button>
            <button
              onClick={() =>
                dispatch(addToCart({
                  _id, title, price
                }))
              }
              className={`w-56 border-2 border-transparent text-center rounded-md px-1 py-2 lg:px-3.5 lg:py-2.5  text-md lg:text-lg  font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isInCart ? 'bg-white text-gray-900' : 'bg-black text-amber-500 hover:bg-gray-900 hover:text-white'
              }`}
            >
              {isInCart ? 'REMOVE FROM CART' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </div>
      {/* Youtube redirect dialogue */}
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
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base lg:text-2xl font-semibold leading-6 text-gray-900">
                          GUIDELINE
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-md lg:text-xl text-gray-500">
                            Our YouTube channel awaits your visit, where you can delve into a thorough description of the course as well as browse through the uplifting comments left by our satisfiers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-md font-semibold text-amber-500 shadow-sm hover:bg-amber-500 hover:text-white sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Ok
                    </button>
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
    </div>
  );
};

export default Card;
