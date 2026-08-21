import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function ApprovalQueue({ onDecisionUpdated }) {
    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState("");

    const fetchPendingDecisions = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/agent/decisions/pending`
            );

            if (!response.ok) {
                throw new Error("Pending decisions fetch nahi ho paaye");
            }

            const data = await response.json();

            setDecisions(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Approval queue load nahi ho pa rahi.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingDecisions();

        // Har 6 seconds queue refresh
        const interval = setInterval(() => {
            fetchPendingDecisions();
        }, 6000);

        return () => clearInterval(interval);
    }, [fetchPendingDecisions]);

    const handleDecision = async (decisionId, action) => {
        try {
            setProcessingId(decisionId);
            setError("");

            const response = await fetch(
                `${API_URL}/api/agent/decisions/${decisionId}/${action}`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Decision update failed");
            }

            setDecisions((current) =>
                current.filter((decision) => decision.id !== decisionId)
            );

            if (onDecisionUpdated) {
                onDecisionUpdated();
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Decision update nahi hua.");
        } finally {
            setProcessingId(null);
        }
    };

    const getDecisionTitle = (type) => {
        switch (type) {
            case "DISCOUNT_OFFERED":
                return "Discount Approval";

            case "PAYMENT_RETRY_OFFERED":
                return "Recovery Discount";

            case "UPSELL_SUGGESTED":
                return "Upsell Approval";

            default:
                return "Agent Decision";
        }
    };

    return (
        <section className="rounded-2xl border border-white/10 bg-[#101010] p-5">

            {/* Header */}

            <div className="mb-6">

                <div className="flex items-start justify-between">

                    <div>
                        <p className="text-xs uppercase tracking-widest text-orange-500">
                            Human Oversight
                        </p>

                        <h2 className="mt-2 text-lg font-semibold">
                            Approval Queue
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Decisions requiring merchant approval.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />

                        <span className="font-mono text-xs text-gray-400">
              {decisions.length} PENDING
            </span>

                    </div>

                </div>

            </div>

            {/* Error */}

            {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Loading */}

            {loading && (
                <div className="rounded-xl border border-white/10 bg-black p-6 text-center text-sm text-gray-500">
                    Loading approval queue...
                </div>
            )}

            {/* Empty */}

            {!loading && decisions.length === 0 && !error && (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">

                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <span className="text-green-400">
              ✓
            </span>
                    </div>

                    <p className="text-sm text-gray-400">
                        No pending approvals
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                        Agent decisions are currently clear.
                    </p>

                </div>
            )}

            {/* Decisions */}

            {!loading && decisions.length > 0 && (
                <div className="space-y-4">

                    {decisions.map((decision) => (

                        <div
                            key={decision.id}
                            className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4"
                        >

                            {/* Title */}

                            <div className="flex items-start justify-between gap-3">

                                <div>

                                    <p className="text-sm font-semibold text-orange-400">
                                        {getDecisionTitle(
                                            decision.decisionType
                                        )}
                                    </p>

                                    <p className="mt-1 font-mono text-xs text-gray-600">
                                        DECISION #{decision.id}
                                    </p>

                                </div>

                                <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-400">
                  PENDING
                </span>

                            </div>

                            {/* Order */}

                            {decision.order && (
                                <div className="mt-4 flex justify-between text-sm">

                  <span className="text-gray-500">
                    Order
                  </span>

                                    <span className="font-mono">
                    #{decision.order.id}
                  </span>

                                </div>
                            )}

                            {/* Reasoning */}

                            <div className="mt-4">

                                <p className="text-xs uppercase tracking-wider text-gray-600">
                                    Agent Reasoning
                                </p>

                                <p className="mt-1 text-sm leading-6 text-gray-400">
                                    {decision.reasoning}
                                </p>

                            </div>

                            {/* Proposed Value */}

                            {decision.proposedValue !== null &&
                                decision.proposedValue !== undefined && (
                                    <div className="mt-4 flex justify-between border-t border-white/5 pt-3">

                    <span className="text-xs text-gray-600">
                      Proposed Value
                    </span>

                                        <span className="font-mono font-semibold text-white">
                      ₹
                                            {Number(
                                                decision.proposedValue
                                            ).toLocaleString("en-IN")}
                    </span>

                                    </div>
                                )}

                            {/* Actions */}

                            <div className="mt-5 grid grid-cols-2 gap-2">

                                <button
                                    disabled={processingId === decision.id}
                                    onClick={() =>
                                        handleDecision(
                                            decision.id,
                                            "approve"
                                        )
                                    }
                                    className="rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processingId === decision.id
                                        ? "Processing..."
                                        : "Approve"}
                                </button>

                                <button
                                    disabled={processingId === decision.id}
                                    onClick={() =>
                                        handleDecision(
                                            decision.id,
                                            "reject"
                                        )
                                    }
                                    className="rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Reject
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

            {/* Poll indicator */}

            <div className="mt-5 border-t border-white/5 pt-3 text-center">
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-700">
                    Auto-refreshing every 6 seconds
                </p>
            </div>

        </section>
    );
}

export default ApprovalQueue;