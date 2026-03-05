export default function Footer() {
    return (
        <footer className="border-t border-[var(--dark-border)] py-4 px-6 text-center text-xs text-[var(--text-muted)]">
            <p>
                © {new Date().getFullYear()} LifeQuest — Coding Your Life, Leveling Your Future.
            </p>
        </footer>
    );
}
