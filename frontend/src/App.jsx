import { useState } from "react";

import Header from "./components/Header";
import ProductManager from "./components/ProductManager";
import OrderComposer from "./components/OrderComposer";
import ReasoningLedger from "./components/ReasoningLedger";
import ApprovalQueue from "./components/ApprovalQueue";
import AgentPolicy from "./components/AgentPolicy";

function App() {
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [decisionRefreshKey, setDecisionRefreshKey] = useState(0);

    return (
        <div className="min-h-screen bg-[#080808] text-white">

            <Header />

            <main className="mx-auto max-w-[1600px] px-6 py-6">

                <div className="mb-5">
                    <h2 className="text-2xl font-semibold">
                        Commerce Operations
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage merchant products and monitor AI-driven transactions.
                    </p>
                </div>

                {/* Product Catalog */}
                <div className="mb-5">
                    <ProductManager />
                </div>

                {/* Agent Policy */}
                <div className="mb-5">
                    <AgentPolicy />
                </div>

                {/* Agent Control Room */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

                    <OrderComposer
                        onOrderCreated={(order) => {
                            setActiveOrderId(order.id);
                        }}
                    />

                    <ReasoningLedger
                        orderId={activeOrderId}
                        refreshKey={decisionRefreshKey}
                    />

                    <ApprovalQueue
                        onDecisionUpdated={() => {
                            setDecisionRefreshKey(
                                (value) => value + 1
                            );
                        }}
                    />

                </div>

            </main>

        </div>
    );
}

export default App;