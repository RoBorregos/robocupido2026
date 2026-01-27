import { type Session } from "next-auth";

interface HeaderProps {
    session: Session | null;
}

const Header = ({ session }: HeaderProps) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
            <header className="glass-border flex h-16 w-full max-w-[960px] items-center justify-between rounded-full bg-white/60 px-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/70">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full">
                        <img src="/black_logo.png" alt="Roborregos Logo" className="h-full w-full object-contain" />
                    </div>
                    <h2 className="text-lg font-extrabold tracking-tight text-wine transition-colors group-hover:text-primary">
                        RoboCupido
                    </h2>
                </div>

                <nav className="flex items-center gap-6">
                    <div className="flex items-center gap-5 mr-2 border-r border-primary/10 pr-6">
                        <a
                            href="https://roborregos.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-dust hover:text-primary transition-all duration-300 transform hover:scale-110"
                            title="Website"
                        >
                            <span className="material-symbols-outlined text-[22px]">public</span>
                        </a>
                        <a
                            href="https://instagram.com/roborregos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-dust hover:text-primary transition-all duration-300 transform hover:scale-110"
                            title="Instagram"
                        >
                            <svg className="h-[20px] w-[20px] fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                    <button className="premium-button-glow flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#ff4d7d] px-8 text-xs font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-primary/40 active:scale-95">
                        {session ? "Mi Perfil" : "Iniciar Sesión"}
                    </button>
                </nav>
            </header>
        </div>
    );
}

export default Header;
