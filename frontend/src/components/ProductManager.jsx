import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

const MERCHANT_ID = 1;

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        pairsWithCategory: "",
    });

    // Backend se products load karo
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/products/merchant/${MERCHANT_ID}`
            );

            if (!response.ok) {
                throw new Error("Products fetch nahi ho paaye");
            }

            const data = await response.json();

            setProducts(data);
        } catch (err) {
            console.error(err);
            setError("Backend se products load nahi ho paaye.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/products`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name,
                        price: Number(form.price),
                        category: form.category,
                        pairsWithCategory:
                            form.pairsWithCategory || null,
                        merchant: {
                            id: MERCHANT_ID,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || "Product create nahi hua"
                );
            }

            const newProduct = await response.json();

            // UI mein immediately product add
            setProducts((current) => [
                ...current,
                newProduct,
            ]);

            // Form reset
            setForm({
                name: "",
                price: "",
                category: "",
                pairsWithCategory: "",
            });

            // Form close
            setShowForm(false);

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Product create nahi hua."
            );
        }
    };

    return (
        <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">

            {/* Header */}

            <div className="mb-6 flex items-start justify-between">

                <div>
                    <p className="text-xs uppercase tracking-widest text-orange-500">
                        Merchant
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                        Product Catalog
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Products available to AI buyers.
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400"
                >
                    {showForm ? "Close" : "+ Add Product"}
                </button>

            </div>
            {/* Add Product Form */}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-xl border border-orange-500/20 bg-black p-5"
                >

                    <div className="mb-5">
                        <h3 className="font-semibold">
                            Add New Product
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Make this product available to AI buyers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Product Name */}

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">
                                Product Name
                            </label>

                            <input
                                required
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Gaming Mouse"
                                className="w-full rounded-lg border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm outline-none placeholder:text-gray-600 focus:border-orange-500"
                            />
                        </div>

                        {/* Price */}

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">
                                Price (₹)
                            </label>

                            <input
                                required
                                type="number"
                                min="1"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="2499"
                                className="w-full rounded-lg border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm outline-none placeholder:text-gray-600 focus:border-orange-500"
                            />
                        </div>

                        {/* Category */}

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">
                                Category
                            </label>

                            <input
                                required
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="e.g. accessory"
                                className="w-full rounded-lg border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm outline-none placeholder:text-gray-600 focus:border-orange-500"
                            />
                        </div>

                        {/* Pairs With */}

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">
                                Pairs With Category
                            </label>

                            <input
                                name="pairsWithCategory"
                                value={form.pairsWithCategory}
                                onChange={handleChange}
                                placeholder="e.g. phone"
                                className="w-full rounded-lg border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm outline-none placeholder:text-gray-600 focus:border-orange-500"
                            />

                            <p className="mt-1 text-xs text-gray-600">
                                Used by the AI for upsell suggestions.
                            </p>
                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="mt-5 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-black hover:bg-orange-400"
                        >
                            Add Product
                        </button>

                    </div>

                </form>
            )}

            {/* Loading */}

            {loading && (
                <div className="rounded-xl border border-white/10 bg-black p-5 text-center text-sm text-gray-500">
                    Loading products...
                </div>
            )}

            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Products */}

            {!loading && !error && (
                <div className="space-y-3">

                    {products.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                            <p className="text-sm text-gray-500">
                                No products found.
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                                Add your first product to make it available to AI buyers.
                            </p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-black p-4"
                            >

                                <div>
                                    <p className="text-sm font-medium">
                                        {product.name}
                                    </p>

                                    <p className="mt-1 font-mono text-xs text-gray-500">
                                        ID: {product.id}
                                    </p>

                                    <span className="mt-2 inline-block rounded-full bg-white/5 px-2 py-1 text-xs text-gray-400">
                    {product.category}
                  </span>
                                </div>

                                <div className="text-right">

                                    <p className="font-mono text-sm">
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </p>

                                    {product.pairsWithCategory && (
                                        <p className="mt-1 text-xs text-orange-400">
                                            Pairs with: {product.pairsWithCategory}
                                        </p>
                                    )}

                                    <p className="mt-1 text-xs text-green-400">
                                        Available to AI buyers
                                    </p>

                                </div>

                            </div>
                        ))
                    )}

                </div>
            )}

        </section>
    );
}

export default ProductManager;