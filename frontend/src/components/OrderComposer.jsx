import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";
const MERCHANT_ID = 1;
const RAZORPAY_KEY_ID = "rzp_test_TS47C6d5Dc8yz4";

function OrderComposer({ onOrderCreated }){
    const [products, setProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [creatingOrder, setCreatingOrder] = useState(false);

    const [error, setError] = useState("");
    const [order, setOrder] = useState(null);

    // Products load karo
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);

                const response = await fetch(
                    `${API_URL}/api/products/merchant/${MERCHANT_ID}`
                );

                if (!response.ok) {
                    throw new Error("Products load nahi ho paaye");
                }

                const data = await response.json();

                setProducts(data);

                // First product automatically select
                if (data.length > 0) {
                    setSelectedProduct(data[0].id.toString());
                }
            } catch (err) {
                console.error(err);
                setError("Products load nahi ho paaye.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };
    const openRazorpayCheckout = async (createdOrder) => {
        const loaded = await loadRazorpay();

        if (!loaded) {
            setError("Razorpay Checkout load nahi hua.");
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,

            amount: Math.round(createdOrder.totalAmount * 100),

            currency: "INR",

            name: "Test Store",

            description: "AI Agent Commerce Order",

            order_id: createdOrder.razorpayOrderId,

            handler: function (response) {
                console.log("Payment successful:", response);

                // Backend/webhook se actual status check karo
                pollOrderStatus(createdOrder.id);
            },

            prefill: {
                name: "AI Buyer",
                email: "buyer@example.com",
            },

            theme: {
                color: "#f97316",
            },
        };

        // Razorpay instance
        const razorpay = new window.Razorpay(options);

        // 👇 YAHAN payment.failed wala code
        razorpay.on("payment.failed", function (response) {
            console.log("Payment failed:", response);

            pollOrderStatus(createdOrder.id);

            setError(
                response.error?.description ||
                "Payment failed"
            );
        });

        // 👇 Sabse last mein checkout open
        razorpay.open();
    };
    const pollOrderStatus = (orderId) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/orders/${orderId}`
                );

                if (!response.ok) return;

                const updatedOrder = await response.json();

                setOrder(updatedOrder);

                if (
                    updatedOrder.status === "PAID" ||
                    updatedOrder.status === "FAILED"
                ) {
                    clearInterval(interval);
                }
            } catch (err) {
                console.error(err);
            }
        }, 3000);

        return interval;
    };

    const selectedProductData = products.find(
        (product) => product.id.toString() === selectedProduct
    );

    const totalAmount = selectedProductData
        ? selectedProductData.price * Number(quantity)
        : 0;

    // Order create karo
    const handleCreateOrder = async () => {
        if (!selectedProduct) {
            setError("Please select a product.");
            return;
        }

        if (quantity < 1) {
            setError("Quantity minimum 1 honi chahiye.");
            return;
        }

        try {
            setCreatingOrder(true);
            setError("");
            setOrder(null);

            const response = await fetch(`${API_URL}/api/orders/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    merchantId: MERCHANT_ID,
                    productIds: [Number(selectedProduct)],
                    quantities: [Number(quantity)],
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Order create nahi hua");
            }

            const data = await response.json();

            setOrder(data);
            onOrderCreated(data);

            await openRazorpayCheckout(data);

            console.log("Created order:", data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Order create nahi hua.");
        } finally {
            setCreatingOrder(false);
        }
    };

    return (
        <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">

            {/* Header */}

            <div className="mb-6">

                <p className="text-xs uppercase tracking-widest text-orange-500">
                    AI Buyer
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                    Place Order
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Create a transaction using the merchant catalog.
                </p>

            </div>

            {/* Error */}

            {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-5">

                {/* Product */}

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Product
                    </label>

                    {loadingProducts ? (
                        <div className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-gray-500">
                            Loading products...
                        </div>
                    ) : (
                        <select
                            value={selectedProduct}
                            onChange={(e) => {
                                setSelectedProduct(e.target.value);
                                setOrder(null);
                            }}
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                        >
                            {products.length === 0 ? (
                                <option value="">
                                    No products available
                                </option>
                            ) : (
                                products.map((product) => (
                                    <option
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.name} — ₹
                                        {product.price.toLocaleString("en-IN")}
                                    </option>
                                ))
                            )}
                        </select>
                    )}
                </div>

                {/* Quantity */}

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Quantity
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                            setOrder(null);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
                    />
                </div>

                {/* Order Preview */}

                {selectedProductData && (
                    <div className="rounded-xl border border-white/10 bg-black p-4">

                        <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Product
              </span>

                            <span>
                {selectedProductData.name}
              </span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">
                Unit price
              </span>

                            <span className="font-mono">
                ₹{selectedProductData.price.toLocaleString("en-IN")}
              </span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">
                Quantity
              </span>

                            <span>
                {quantity}
              </span>
                        </div>

                        <div className="my-3 border-t border-white/10" />

                        <div className="flex justify-between">
              <span className="font-medium">
                Total
              </span>

                            <span className="font-mono font-semibold text-orange-400">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
                        </div>

                    </div>
                )}

                {/* Create Order */}

                <button
                    onClick={handleCreateOrder}
                    disabled={
                        creatingOrder ||
                        loadingProducts ||
                        products.length === 0
                    }
                    className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {creatingOrder
                        ? "Creating Order..."
                        : "Start Agent Checkout"}
                </button>

            </div>

            {/* Created Order */}

            {order && (
                <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/5 p-4">

                    <div className="flex items-center justify-between">

            <span className="text-sm font-semibold text-green-400">
              Order Created
            </span>

                        <span
                            className={`rounded-full px-2 py-1 text-xs ${
                                order.status === "PAID"
                                    ? "bg-green-500/10 text-green-400"
                                    : order.status === "FAILED"
                                        ? "bg-red-500/10 text-red-400"
                                        : "bg-orange-500/10 text-orange-400"
                            }`}
                        >
  {order.status}
</span>

                    </div>

                    <div className="mt-3 space-y-2 text-sm">

                        <div className="flex justify-between">
              <span className="text-gray-500">
                Order ID
              </span>

                            <span className="font-mono">
                #{order.id}
              </span>
                        </div>

                        <div className="flex justify-between">
              <span className="text-gray-500">
                Razorpay Order
              </span>

                            <span className="font-mono text-xs">
                {order.razorpayOrderId}
              </span>
                        </div>

                        <div className="flex justify-between">
              <span className="text-gray-500">
                Amount
              </span>

                            <span className="font-mono">
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </span>
                        </div>

                    </div>

                </div>
            )}

        </section>
    );
}

export default OrderComposer;