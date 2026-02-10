import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, removeFromCart } from "../store/cartSlice";

export default function Cart() {

    const { items, totalAmount } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    return (
        <div className={`container mx-auto my-10 p-3`}>
            <h1 className="text-2xl font-bold my-10">Shopping Cart</h1>
            <h3>Total Cart Price: ${totalAmount}</h3>

            <div
                className={`flex justify-center items-center gap-5
                flex-col lg:flex-row flex-wrap`}
            >
                {
                    items.map((p) => {
                        const itemId = p.id || p._id;
                        return (
                        <div
                            className={`product 
                                w-full lg:w-150
                                flex items-center gap-10 
                            shadow-[0_0_25px_rgba(0,0,0,0.15)] p-3 rounded-md 
                            flex-col md:flex-row md:flex-wrap`}
                            key={itemId}
                        >
                            <div
                                className={`img w-30 relative h-30 overflow-hidden rounded-md shrink-0`}
                            >
                                <img 
                                    src={
                                        p.images && p.images.length > 0 
                                            ? `http://localhost:3000${p.images[0]}` 
                                            : "/fallback.jpg"
                                    } 
                                    alt={p.title || "Product"} 
                                    className={`w-full h-full object-cover`}
                                    onError={(e) => {
                                        e.target.src = "/fallback.jpg";
                                    }}
                                />
                            </div>

                            <div className={`data w-full flex flex-col gap-4`}>
                                <span className={`text-xl font-bold text-gray-700`}>
                                    {p.title} 
                                </span>

                                <span className={`text-md font-semibold text-gray-500`}>
                                    By Ali Store
                                </span>

                                <div className={`flex items-center gap-3`}>
                                    <button
                                        className={`w-7 h-7 bg-red-500 text-white text-lg font-bold rounded-sm
                                        flex justify-center items-center`}
                                        onClick={() => dispatch(decrement(itemId))}
                                    >
                                        -
                                    </button>

                                    <span
                                        className={`w-13 h-9 border border-black rounded-sm
                                        flex justify-center items-center`}
                                    >
                                        {p.quantity}
                                    </span>

                                    <button
                                        className={`w-7 h-7 font-bold bg-green-500 text-white text-lg rounded-sm
                                        flex justify-center items-center`}
                                        onClick={() => dispatch(increment(itemId))}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className={`flex justify-between items-center`}>
                                    <span className={`text-lg font-bold text-blue-500`}>
                                        {p.totalPrice}$
                                    </span>

                                    <button
                                        className={`text-white text-lg font-semibold rounded-md bg-red-500 w-50 p-2`}
                                        onClick={() => dispatch(removeFromCart(itemId))}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })
                }

                <div
                    className={`flex flex-col gap-3 shadow-2xl p-3 rounded-md 
                    w-full md:w-150`}
                >
                    <span className={`text-xl font-bold`}>Order Summary</span>

                    <div
                        className={`flex justify-between items-center py-2 border-b border-b-gray-400`}
                    >
                        <span>Subtotal</span>
                        <span>{totalAmount}$</span>
                    </div>

                    <div
                        className={`flex justify-between items-center py-2 border-b border-b-gray-400`}
                    >
                        <span>Shipping</span>
                        <span>80$</span>
                    </div>

                    <div
                        className={`flex justify-between items-center py-2 border-b-2 border-b-gray-800`}
                    >
                        <span>Tax</span>
                        <span>{(totalAmount * 0.1).toFixed(2)}$</span>
                    </div>

                    <div className={`flex justify-between items-center`}>
                        <span className={`font-bold`}>Total</span>
                        <span className={`font-bold`}>
                            {(totalAmount + 80 + totalAmount * 0.1).toFixed(2)}$
                        </span>
                    </div>

                    <button
                        className={`text-white font-semibold rounded-md bg-blue-500 w-full p-2`}
                    >
                        Proceed To Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
