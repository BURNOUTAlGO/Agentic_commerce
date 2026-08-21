import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";
const MERCHANT_ID = 1;

function AgentPolicy() {
    const [form, setForm] = useState({
        maxDiscountPercent: "",
        maxAutoApproveValue: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/agent/policy/merchant/${MERCHANT_ID}`
                );

                if (!response.ok) {
                    // Policy doesn't exist yet
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                setForm({
                    maxDiscountPercent:
                        data.maxDiscountPercent ?? "",
                    maxAutoApproveValue:
                        data.maxAutoApproveValue ?? "",
                });

            } catch (err) {
                console.error(err);
                setError("Policy load nahi ho paayi.");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/api/agent/policy/merchant/${MERCHANT_ID}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        maxDiscountPercent:
                            Number(form.maxDiscountPercent),

                        maxAutoApproveValue:
                            Number(form.maxAutoApproveValue),
                    }),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(
                    text || "Policy save nahi hui"
                );
            }

            const savedPolicy = await response.json();

            setForm({
                maxDiscountPercent:
                savedPolicy.maxDiscountPercent,

                maxAutoApproveValue:
                savedPolicy.maxAutoApproveValue,
            });

            setMessage("Agent policy saved successfully.");

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Policy save nahi hui."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">
                <p className="text-sm text-gray-500">
                    Loading agent policy...
                </p>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">

            <div className="mb-6">

                <p className="text-xs uppercase tracking-widest text-orange-500">
                    Agent Configuration
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                    Agent Policy
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Define how much freedom the AI agent has.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Maximum Discount */}

                <div>

                    <label className="mb-2 block text-sm text-gray-400">
                        Maximum Discount
                    </label>

                    <div className="flex items-center">

                        <input
                            required
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            name="maxDiscountPercent"
                            value={form.maxDiscountPercent}
                            onChange={handleChange}
                            placeholder="15"
                            className="w-full rounded-l-lg border border-white/10 bg-black px-3 py-3 text-sm outline-none focus:border-orange-500"
                        />

                        <span className="border border-l-0 border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400">
                            %
                        </span>

                    </div>

                    <p className="mt-2 text-xs text-gray-600">
                        Maximum discount the agent is allowed to offer.
                    </p>

                </div>

                {/* Auto Approve Value */}

                <div>

                    <label className="mb-2 block text-sm text-gray-400">
                        Maximum Auto-Approve Value
                    </label>

                    <div className="flex items-center">

                        <span className="border border-r-0 border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400">
                            ₹
                        </span>

                        <input
                            required
                            type="number"
                            min="0"
                            step="1"
                            name="maxAutoApproveValue"
                            value={form.maxAutoApproveValue}
                            onChange={handleChange}
                            placeholder="2000"
                            className="w-full rounded-r-lg border border-white/10 bg-black px-3 py-3 text-sm outline-none focus:border-orange-500"
                        />

                    </div>

                    <p className="mt-2 text-xs text-gray-600">
                        Decisions above this value require merchant approval.
                    </p>

                </div>

                {/* Message */}

                {message && (
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Save */}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving
                        ? "Saving..."
                        : "Save Agent Policy"}
                </button>

            </form>

        </section>
    );
}

export default AgentPolicy;