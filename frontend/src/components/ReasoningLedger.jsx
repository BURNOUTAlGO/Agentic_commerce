import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function ReasoningLedger({ orderId,refreshKey }) {
    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) {
            setDecisions([]);
            return;
        }

        const fetchDecisions = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/agent/decisions/order/${orderId}`
                );

                if (!response.ok) {
                    throw new Error("Decisions fetch nahi ho paaye");
                }

                const data = await response.json();

                setDecisions(data);
            } catch (err) {
                console.error(err);
                setError("Agent decisions load nahi ho paaye.");
            } finally {
                setLoading(false);
            }
        };

        fetchDecisions();
    }, [orderId,refreshKey]);

    const getDecisionLabel = (type) => {
        switch (type) {
            case "UPSELL_SUGGESTED":
                return "Upsell Suggested";

            case "DISCOUNT_OFFERED":
                return "Discount Offered";

            case "PAYMENT_RETRY_OFFERED":
                return "Payment Recovery";

            default:
                return type;
        }
    };

    const getDecisionColor = (type) => {
        switch (type) {
            case "PAYMENT_RETRY_OFFERED":
                return "text-orange-400";

            case "DISCOUNT_OFFERED":
                return "text-yellow-400";

            case "UPSELL_SUGGESTED":
                return "text-blue-400";

            default:
                return "text-gray-300";
        }
    };

    return (
        <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">

            {/* Header */}

            <div className="mb-6">

                <p className="text-xs uppercase tracking-widest text-orange-500">
                    Agent Activity
                </p>

                <div className="mt-2 flex items-center justify-between">

                    <h2 className="text-lg font-semibold">
                        Reasoning Ledger
                    </h2>

                    {orderId && (
                        <span className="font-mono text-xs text-gray-500">
              ORDER #{orderId}
            </span>
                    )}

                </div>

                <p className="mt-1 text-sm text-gray-500">
                    Transparent record of agent decisions.
                </p>

            </div>

            {/* No Order */}

            {!orderId && (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">

                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                        <span className="text-gray-500">AI</span>
                    </div>

                    <p className="text-sm text-gray-400">
                        No active order
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                        Create an order to see agent decisions.
                    </p>

                </div>
            )}

            {/* Loading */}

            {orderId && loading && (
                <div className="rounded-xl border border-white/10 bg-black p-5 text-center text-sm text-gray-500">
                    Loading agent decisions...
                </div>
            )}

            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Decisions */}

            {orderId && !loading && !error && (
                <div className="space-y-3">

                    {decisions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">

                            <p className="text-sm text-gray-500">
                                No decisions recorded yet.
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                                The agent has not generated any decisions.
                            </p>

                        </div>
                    ) : (
                        decisions.map((decision) => (
                            <div
                                key={decision.id}
                                className="rounded-xl border border-white/10 bg-black p-4"
                            >

                                {/* Decision Header */}

                                <div className="flex items-start justify-between gap-3">

                                    <div>
                                        <p
                                            className={`text-sm font-semibold ${getDecisionColor(
                                                decision.decisionType
                                            )}`}
                                        >
                                            {getDecisionLabel(decision.decisionType)}
                                        </p>

                                        <p className="mt-1 font-mono text-xs text-gray-600">
                                            DECISION #{decision.id}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            decision.approvalStatus === "PENDING"
                                                ? "bg-orange-500/10 text-orange-400"
                                                : decision.approvalStatus === "APPROVED"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : decision.approvalStatus === "REJECTED"
                                                        ? "bg-red-500/10 text-red-400"
                                                        : "bg-white/5 text-gray-400"
                                        }`}
                                    >
                    {decision.approvalStatus}
                  </span>

                                </div>

                                {/* Reasoning */}

                                <div className="mt-4">

                                    <p className="text-xs uppercase tracking-wider text-gray-600">
                                        Reasoning
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-400">
                                        {decision.reasoning}
                                    </p>

                                </div>

                                {/* Value */}

                                {decision.proposedValue !== null &&
                                    decision.proposedValue !== undefined && (
                                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">

                      <span className="text-xs text-gray-600">
                        Proposed Value
                      </span>

                                            <span className="font-mono text-sm text-white">
                        ₹
                                                {Number(
                                                    decision.proposedValue
                                                ).toLocaleString("en-IN")}
                      </span>

                                        </div>
                                    )}

                                {/* Approval */}

                                <div className="mt-3 flex items-center justify-between">

                  <span className="text-xs text-gray-600">
                    {decision.requiresApproval
                        ? "Merchant approval required"
                        : "Automatically approved"}
                  </span>

                                    {decision.timestamp && (
                                        <span className="font-mono text-xs text-gray-600">
                      {new Date(
                          decision.timestamp
                      ).toLocaleTimeString()}
                    </span>
                                    )}

                                </div>

                            </div>
                        ))
                    )}

                </div>
            )}

        </section>
    );
}

export default ReasoningLedger;