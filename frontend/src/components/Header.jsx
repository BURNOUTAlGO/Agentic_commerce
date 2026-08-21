function Header() {
    return (
        <header className="border-b border-white/10 bg-[#0c0c0c]">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">

                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange-500">
                        Agentic Commerce
                    </p>

                    <h1 className="mt-1 text-xl font-semibold">
                        Commerce Control Room
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-400">
            Agent Online
          </span>
                </div>

            </div>
        </header>
    );
}

export default Header;