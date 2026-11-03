import os
import re
import sys

def clean_file(path, replacements):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    for old, new in replacements:
        if isinstance(old, str):
            content = content.replace(old, new)
        else:
            content = old.sub(new, content)

    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {path}")
    else:
        print(f"No changes in {path}")

def run_all_cleanups():
    # 1. PhysicsVisualizer.tsx
    clean_file('src/design-system/components/PhysicsVisualizer.tsx', [
        ('<div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[var(--phy-tint)] rounded-full blur-2xl pointer-events-none" />', ''),
        ('bg-cyan-500 text-slate-950', 'bg-[var(--phy-fill)] text-white'),
        ('shadow-[0_0_12px_rgba(245,158,11,0.5)]', 'shadow-sm border-b-2 border-amber-600'),
        ('shadow-[0_0_12px_rgba(245,158,11,0.6)]', 'shadow-sm border-b-2 border-amber-600'),
    ])

    # 2. BiologyVisualizer.tsx
    clean_file('src/design-system/components/BiologyVisualizer.tsx', [
        ('<div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />', ''),
    ])

    # 3. CurrencyIcon.tsx
    clean_file('src/design-system/components/CurrencyIcon.tsx', [
        ('<Snowflake className="w-full h-full p-0.5 text-cyan-300" />', '<Snowflake className="w-full h-full p-0.5 text-sky-300" />'),
    ])

    # 4. QuickReferenceDrawer.tsx
    clean_file('src/design-system/components/QuickReferenceDrawer.tsx', [
        ('bg-cyan-500/20 text-[var(--chem-fg)] border-cyan-500/30', 'bg-[var(--chem-tint)] text-[var(--chem-fg)] border-[var(--chem-edge)]'),
    ])

    # 5. ReactionVisualizer.tsx
    clean_file('src/design-system/components/ReactionVisualizer.tsx', [
        ('className="absolute rounded-full border border-white/80 bg-cyan-300/40"', 'className="absolute rounded-full border border-white/80 bg-white/40 shadow-xs"'),
        ('hover:border-cyan-500/30', 'hover:border-[var(--chem-edge)]/40'),
    ])

    # 3. CircuitLab.tsx
    clean_file('src/features/lab/components/CircuitLab.tsx', [
        ('bg-amber-500/10 border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.25)]', 'bg-amber-500/10 border-amber-500 shadow-sm'),
        ('bg-yellow-400 text-slate-950 border-amber-300 shadow-[0_0_12px_#facc15]', 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'),
    ])

    # 4. MicroscopeLab.tsx
    clean_file('src/features/lab/components/MicroscopeLab.tsx', [
        ('bg-emerald-500/15 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]', 'bg-emerald-500/15 border-emerald-600 shadow-sm'),
    ])

    # 5. FormulaBuilderGame.tsx
    clean_file('src/features/minigames/FormulaBuilderGame.tsx', [
        ('border-2 border-cyan-500/30', 'border-2 border-[var(--chem-edge)]/40'),
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
        ('text-cyan-300', 'text-[var(--chem-fg)]'),
        ('bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300', 'bg-[var(--chem-tint)] hover:bg-[var(--chem-tint)]/80 text-[var(--chem-fg)]'),
        ("isNeutral ? 'w-full bg-emerald-500' : netCharge > 0 ? 'bg-cyan-500' : 'bg-pink-500'",
         "isNeutral ? 'w-full bg-[var(--ok-fill)]' : netCharge > 0 ? 'bg-[var(--chem-fill)]' : 'bg-[var(--gem-fill)]'"),
    ])

    # 6. ChapterGuideModal.tsx
    clean_file('src/design-system/components/ChapterGuideModal.tsx', [
        ('bg-cyan-500/20 border border-cyan-500/40', 'bg-[var(--chem-tint)] border border-[var(--chem-edge)]'),
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
        ('text-cyan-300', 'text-[var(--chem-fg)]'),
    ])

    # 7. ChemKeyboard.tsx
    clean_file('src/design-system/components/ChemKeyboard.tsx', [
        ('bg-cyan-500/20 text-cyan-300 border border-cyan-500/40', 'bg-[var(--chem-tint)] text-[var(--chem-fg)] border border-[var(--chem-edge)]'),
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
        ('bg-slate-950/98 backdrop-blur-xl border-t-2 border-slate-800', 'bg-[var(--bg-surface)] border-t-2 border-[var(--border-strong)] shadow-lg'),
    ])

    # 8. PhysicsKeyboard.tsx
    clean_file('src/design-system/components/PhysicsKeyboard.tsx', [
        ('bg-slate-950/98 backdrop-blur-xl border-t-2 border-slate-800', 'bg-[var(--bg-surface)] border-t-2 border-[var(--border-strong)] shadow-lg'),
    ])

    # 9. FeedbackSheet.tsx
    clean_file('src/design-system/components/FeedbackSheet.tsx', [
        ('backdrop-blur-2xl shadow-[var(--shadow-modal)]', 'bg-[var(--bg-surface)] shadow-[var(--shadow-modal)]'),
    ])

    # 10. DesignSystemPage.tsx
    clean_file('src/app/pages/DesignSystemPage.tsx', [
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
        ('bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-[0_0_10px_rgba(6,182,212,0.4)]', 'bg-[var(--chem-fill)] text-white border-[var(--chem-edge)] font-black shadow-sm'),
        ('bg-cyan-950/40 text-cyan-300 border border-cyan-700/50', 'bg-[var(--chem-tint)] text-[var(--chem-fg)] border border-[var(--chem-edge)]'),
    ])

    # 11. QuickReferenceDrawer.tsx
    clean_file('src/design-system/components/QuickReferenceDrawer.tsx', [
        ('bg-cyan-500/20 text-cyan-300 border border-cyan-500/40', 'bg-[var(--chem-tint)] text-[var(--chem-fg)] border border-[var(--chem-edge)]'),
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
        ('text-cyan-300', 'text-[var(--chem-fg)]'),
    ])

    # 12. Minigames (EquationBalanceGame, MatchGame, TrueFalseGame, ReviewGame, SortGame, SpeedChallengeGame, ReactionBuilderGame)
    clean_file('src/features/minigames/EquationBalanceGame.tsx', [
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
    ])
    clean_file('src/features/minigames/MatchGame.tsx', [
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
        ('bg-cyan-950/80 border border-cyan-700/60 text-cyan-300', 'bg-[var(--chem-tint)] border border-[var(--chem-edge)] text-[var(--chem-fg)]'),
        ('bg-cyan-950/30 text-cyan-400', 'bg-[var(--chem-tint)] text-[var(--chem-fg)]'),
    ])
    clean_file('src/features/minigames/ReactionBuilderGame.tsx', [
        ('text-cyan-300', 'text-[var(--chem-fg)] font-bold'),
    ])
    clean_file('src/features/minigames/ReviewGame.tsx', [
        ('text-cyan-400', 'text-[var(--chem-fg)]'),
    ])
    clean_file('src/features/minigames/SortGame.tsx', [
        ('text-cyan-400 font-black', 'text-[var(--chem-fg)] font-black'),
    ])
    clean_file('src/features/minigames/SpeedChallengeGame.tsx', [
        ('text-cyan-300', 'text-[var(--chem-fg)]'),
    ])
    clean_file('src/features/minigames/TrueFalseGame.tsx', [
        ('text-cyan-400 font-black', 'text-[var(--chem-fg)] font-black'),
    ])

if __name__ == '__main__':
    run_all_cleanups()
