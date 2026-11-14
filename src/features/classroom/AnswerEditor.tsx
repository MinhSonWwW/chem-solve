import React from 'react';
import { Plus, X, ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { Answer } from '@/content/schema/exercise';
import { equationWarning, nextId } from './setDraft';

/** Shared look for inputs in the teacher editor (design tokens only). */
export const inputCls =
  'h-10 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)] min-w-0 w-full';
const smallBtn =
  'shrink-0 w-9 h-9 rounded-xl border border-[var(--border)] text-[var(--text-tertiary)] inline-flex items-center justify-center cursor-pointer disabled:opacity-40';
const addBtn =
  'inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-dashed border-[var(--border-strong)] text-xs font-black text-[var(--text-secondary)] cursor-pointer';
const hintCls = 'text-xs text-[var(--text-tertiary)]';

const RemoveBtn: React.FC<{ onClick: () => void; disabled?: boolean; label: string }> = ({ onClick, disabled, label }) => (
  <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={smallBtn}>
    <X className="w-4 h-4" />
  </button>
);

/** Choice-style toggle: the "this one is correct" control. */
const CorrectToggle: React.FC<{ on: boolean; onClick: () => void; label: string; round?: boolean }> = ({ on, onClick, label, round }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    aria-label={label}
    className={`shrink-0 w-9 h-9 ${round ? 'rounded-full' : 'rounded-xl'} border inline-flex items-center justify-center cursor-pointer ${
      on ? 'bg-[var(--ok-fill)] border-[var(--ok-fill)] text-white' : 'border-[var(--border)] text-transparent'
    }`}
  >
    <Check className="w-4 h-4" />
  </button>
);

/** Editable list of strings (one input per line). */
const StringList: React.FC<{
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: (i: number) => string;
  min: number;
  addLabel: string;
  reorder?: boolean;
}> = ({ values, onChange, placeholder, min, addLabel, reorder }) => (
  <div className="space-y-2">
    {values.map((v, i) => (
      <div key={i} className="flex gap-2 items-center">
        {reorder && <span className="w-5 text-xs font-black text-[var(--text-tertiary)] text-right">{i + 1}.</span>}
        <input className={inputCls} value={v} placeholder={placeholder(i)} onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))} />
        {reorder && (
          <>
            <button
              type="button"
              className={smallBtn}
              disabled={i === 0}
              aria-label="Đưa lên"
              onClick={() => {
                const next = [...values];
                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                onChange(next);
              }}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={smallBtn}
              disabled={i === values.length - 1}
              aria-label="Đưa xuống"
              onClick={() => {
                const next = [...values];
                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                onChange(next);
              }}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </>
        )}
        <RemoveBtn label="Xóa dòng" disabled={values.length <= min} onClick={() => onChange(values.filter((_, j) => j !== i))} />
      </div>
    ))}
    <button type="button" className={addBtn} onClick={() => onChange([...values, ''])}>
      <Plus className="w-3.5 h-3.5" /> {addLabel}
    </button>
  </div>
);

/** Editor for the answer of one teacher question, for every answer kind the app supports. */
export const AnswerEditor: React.FC<{ answer: Answer; onChange: (a: Answer) => void }> = ({ answer: a, onChange }) => {
  switch (a.kind) {
    case 'mcq-single':
    case 'mcq-multi': {
      const isCorrect = (id: string) => (a.kind === 'mcq-single' ? a.correctId === id : a.correctIds.includes(id));
      const toggle = (id: string) =>
        a.kind === 'mcq-single'
          ? onChange({ ...a, correctId: id })
          : onChange({ ...a, correctIds: a.correctIds.includes(id) ? a.correctIds.filter((x) => x !== id) : [...a.correctIds, id] });
      return (
        <div className="space-y-2">
          <p className={hintCls}>
            {a.kind === 'mcq-single' ? 'Bấm ô tròn để chọn đáp án đúng.' : 'Bấm ô vuông ở mọi đáp án đúng.'} Thứ tự phương án sẽ được xáo khi học
            sinh làm. Công thức trong phương án cũng viết trong ngoặc, ví dụ <code>[[H2SO4]]</code>.
          </p>
          {a.options.map((o, i) => (
            <div key={o.id} className="flex gap-2 items-center">
              <CorrectToggle on={isCorrect(o.id)} onClick={() => toggle(o.id)} label={`Phương án ${i + 1} là đáp án đúng`} round={a.kind === 'mcq-single'} />
              <input
                className={inputCls}
                value={o.label}
                placeholder={`Phương án ${String.fromCharCode(65 + i)}`}
                onChange={(e) => onChange({ ...a, options: a.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) } as Answer)}
              />
              <RemoveBtn
                label="Xóa phương án"
                disabled={a.options.length <= 2}
                onClick={() =>
                  onChange(
                    a.kind === 'mcq-single'
                      ? { ...a, options: a.options.filter((x) => x.id !== o.id), correctId: a.correctId === o.id ? '' : a.correctId }
                      : { ...a, options: a.options.filter((x) => x.id !== o.id), correctIds: a.correctIds.filter((x) => x !== o.id) }
                  )
                }
              />
            </div>
          ))}
          {a.options.length < 6 && (
            <button
              type="button"
              className={addBtn}
              onClick={() => onChange({ ...a, options: [...a.options, { id: nextId('o', a.options.map((o) => o.id)), label: '' }] } as Answer)}
            >
              <Plus className="w-3.5 h-3.5" /> Thêm phương án
            </button>
          )}
        </div>
      );
    }

    case 'true-false':
      return (
        <div className="space-y-2">
          <p className={hintCls}>Mỗi mệnh đề chọn Đúng hoặc Sai.</p>
          {a.statements.map((st, i) => (
            <div key={st.id} className="flex gap-2 items-center">
              <span className="w-5 text-xs font-black text-[var(--text-tertiary)]">{String.fromCharCode(97 + i)})</span>
              <input
                className={inputCls}
                value={st.text}
                placeholder="Mệnh đề"
                onChange={(e) => onChange({ ...a, statements: a.statements.map((x) => (x.id === st.id ? { ...x, text: e.target.value } : x)) })}
              />
              <div className="shrink-0 flex rounded-xl border border-[var(--border)] overflow-hidden text-xs font-black">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    aria-pressed={st.correct === val}
                    onClick={() => onChange({ ...a, statements: a.statements.map((x) => (x.id === st.id ? { ...x, correct: val } : x)) })}
                    className={`h-9 px-2.5 cursor-pointer ${
                      st.correct === val ? (val ? 'bg-[var(--ok-fill)] text-white' : 'bg-[var(--err-fill)] text-white') : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {val ? 'Đúng' : 'Sai'}
                  </button>
                ))}
              </div>
              <RemoveBtn
                label="Xóa mệnh đề"
                disabled={a.statements.length <= 1}
                onClick={() => onChange({ ...a, statements: a.statements.filter((x) => x.id !== st.id) })}
              />
            </div>
          ))}
          <button
            type="button"
            className={addBtn}
            onClick={() => onChange({ ...a, statements: [...a.statements, { id: nextId('s', a.statements.map((s) => s.id)), text: '', correct: true }] })}
          >
            <Plus className="w-3.5 h-3.5" /> Thêm mệnh đề
          </button>
        </div>
      );

    case 'number':
      return <NumberEditor answer={a} onChange={onChange} />;

    case 'text':
    case 'formula':
      return (
        <div className="space-y-2">
          <p className={hintCls}>
            {a.kind === 'formula'
              ? 'Viết công thức kiểu H2SO4, Fe2O3, Fe^3+ (không cần chỉ số dưới). Có thể thêm nhiều cách viết được chấp nhận.'
              : 'Thêm các cách trả lời được chấp nhận (không phân biệt hoa thường).'}
          </p>
          <StringList
            values={a.accepted}
            min={1}
            addLabel="Thêm cách viết khác"
            placeholder={(i) => (i === 0 ? (a.kind === 'formula' ? 'Ví dụ: H2SO4' : 'Đáp án') : 'Cách viết khác')}
            onChange={(accepted) => onChange({ ...a, accepted } as Answer)}
          />
          {a.kind === 'text' && (
            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={a.lenientDiacritics ?? false}
                onChange={(e) => onChange({ ...a, lenientDiacritics: e.target.checked })}
              />
              Chấp nhận khi học sinh gõ thiếu dấu
            </label>
          )}
        </div>
      );

    case 'formula-builder':
      return (
        <div className="space-y-2">
          <p className={hintCls}>Học sinh bấm các thẻ để ghép thành công thức. Nên thêm vài thẻ gây nhiễu.</p>
          <input
            className={inputCls}
            value={a.accepted[0] ?? ''}
            placeholder="Công thức đúng, ví dụ: H2SO4"
            onChange={(e) => onChange({ ...a, accepted: [e.target.value] })}
          />
          <input
            className={inputCls}
            value={a.tiles.join(' ')}
            placeholder="Các thẻ, cách nhau bởi dấu cách: H 2 S O 4 Cl"
            onChange={(e) => onChange({ ...a, tiles: e.target.value.split(' ') })}
          />
        </div>
      );

    case 'equation':
      return <EquationEditor answer={a} onChange={onChange} />;

    case 'match':
      return (
        <div className="space-y-2">
          <p className={hintCls}>Mỗi dòng là một cặp đúng. Cột phải sẽ được xáo khi học sinh làm.</p>
          {a.pairs.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input
                className={inputCls}
                value={p.left}
                placeholder="Vế trái"
                onChange={(e) => onChange({ ...a, pairs: a.pairs.map((x, j) => (j === i ? { ...x, left: e.target.value } : x)) })}
              />
              <input
                className={inputCls}
                value={p.right}
                placeholder="Vế phải"
                onChange={(e) => onChange({ ...a, pairs: a.pairs.map((x, j) => (j === i ? { ...x, right: e.target.value } : x)) })}
              />
              <RemoveBtn label="Xóa cặp" disabled={a.pairs.length <= 2} onClick={() => onChange({ ...a, pairs: a.pairs.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <button type="button" className={addBtn} onClick={() => onChange({ ...a, pairs: [...a.pairs, { left: '', right: '' }] })}>
            <Plus className="w-3.5 h-3.5" /> Thêm cặp
          </button>
        </div>
      );

    case 'sort':
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <p className="text-xs font-black text-[var(--text-secondary)]">Các nhóm</p>
            {a.buckets.map((b, i) => (
              <div key={b.id} className="flex gap-2 items-center">
                <input
                  className={inputCls}
                  value={b.label}
                  placeholder={`Nhóm ${i + 1}, ví dụ: Acid`}
                  onChange={(e) => onChange({ ...a, buckets: a.buckets.map((x) => (x.id === b.id ? { ...x, label: e.target.value } : x)) })}
                />
                <RemoveBtn
                  label="Xóa nhóm"
                  disabled={a.buckets.length <= 2}
                  onClick={() => {
                    const buckets = a.buckets.filter((x) => x.id !== b.id);
                    onChange({ ...a, buckets, items: a.items.map((it) => (it.bucketId === b.id ? { ...it, bucketId: buckets[0].id } : it)) });
                  }}
                />
              </div>
            ))}
            <button type="button" className={addBtn} onClick={() => onChange({ ...a, buckets: [...a.buckets, { id: nextId('b', a.buckets.map((b) => b.id)), label: '' }] })}>
              <Plus className="w-3.5 h-3.5" /> Thêm nhóm
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black text-[var(--text-secondary)]">Các mục và nhóm đúng của mỗi mục</p>
            {a.items.map((it) => (
              <div key={it.id} className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_12rem_auto] gap-2 items-center">
                <input
                  className={inputCls}
                  value={it.label}
                  placeholder="Mục, ví dụ: HCl"
                  onChange={(e) => onChange({ ...a, items: a.items.map((x) => (x.id === it.id ? { ...x, label: e.target.value } : x)) })}
                />
                <select
                  className={`${inputCls} w-32 sm:w-full`}
                  value={it.bucketId}
                  aria-label="Nhóm đúng"
                  onChange={(e) => onChange({ ...a, items: a.items.map((x) => (x.id === it.id ? { ...x, bucketId: e.target.value } : x)) })}
                >
                  {a.buckets.map((b, i) => (
                    <option key={b.id} value={b.id}>
                      {b.label || `Nhóm ${i + 1}`}
                    </option>
                  ))}
                </select>
                <RemoveBtn label="Xóa mục" disabled={a.items.length <= 2} onClick={() => onChange({ ...a, items: a.items.filter((x) => x.id !== it.id) })} />
              </div>
            ))}
            <button
              type="button"
              className={addBtn}
              onClick={() => onChange({ ...a, items: [...a.items, { id: nextId('i', a.items.map((i) => i.id)), label: '', bucketId: a.buckets[0].id }] })}
            >
              <Plus className="w-3.5 h-3.5" /> Thêm mục
            </button>
          </div>
        </div>
      );

    case 'ordering':
      return (
        <div className="space-y-2">
          <p className={hintCls}>Nhập các bước theo đúng thứ tự. Học sinh sẽ thấy chúng bị xáo trộn.</p>
          <StringList
            values={a.correctOrder}
            min={2}
            reorder
            addLabel="Thêm bước"
            placeholder={(i) => `Bước ${i + 1}`}
            onChange={(correctOrder) => onChange({ ...a, correctOrder })}
          />
        </div>
      );
  }
};

const NumberEditor: React.FC<{ answer: Extract<Answer, { kind: 'number' }>; onChange: (a: Answer) => void }> = ({ answer: a, onChange }) => {
  // Keep what the teacher typed ("12,395") while storing a number.
  const [text, setText] = React.useState(Number.isFinite(a.value) ? String(a.value).replace('.', ',') : '');
  const relPct = Math.round((a.tolerance?.rel ?? 0) * 1000) / 10;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_7rem] gap-2">
        <input
          className={inputCls}
          inputMode="decimal"
          value={text}
          placeholder="Đáp số, ví dụ: 12,395"
          onChange={(e) => {
            setText(e.target.value);
            const v = e.target.value.trim().replace(',', '.');
            onChange({ ...a, value: v === '' ? Number.NaN : Number(v) });
          }}
        />
        <input className={inputCls} value={a.unit ?? ''} placeholder="Đơn vị: L, g, N" onChange={(e) => onChange({ ...a, unit: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        Chấp nhận sai lệch
        <select
          className={`${inputCls} w-24`}
          value={String(relPct)}
          onChange={(e) => onChange({ ...a, tolerance: Number(e.target.value) > 0 ? { rel: Number(e.target.value) / 100 } : undefined })}
        >
          {[0, 0.5, 1, 2, 5].map((p) => (
            <option key={p} value={String(p)}>
              {p === 0 ? 'Chính xác' : `± ${String(p).replace('.', ',')}%`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

const EquationEditor: React.FC<{ answer: Extract<Answer, { kind: 'equation' }>; onChange: (a: Answer) => void }> = ({ answer: a, onChange }) => {
  const warning = equationWarning(a);
  const setSide = (side: 'reactants' | 'products', values: string[]) => {
    const reactants = side === 'reactants' ? values : a.reactants;
    const products = side === 'products' ? values : a.products;
    // Keep each coefficient attached to its substance when rows are added/removed.
    const oldR = a.coefficients.slice(0, a.reactants.length);
    const oldP = a.coefficients.slice(a.reactants.length);
    const fit = (old: number[], n: number) => Array.from({ length: n }, (_, i) => old[i] ?? 1);
    onChange({ ...a, reactants, products, coefficients: [...fit(oldR, reactants.length), ...fit(oldP, products.length)] });
  };
  const sideEditor = (side: 'reactants' | 'products', label: string, offset: number) => {
    const values = a[side];
    return (
      <div className="space-y-2">
        <p className="text-xs font-black text-[var(--text-secondary)]">{label}</p>
        {values.map((f, i) => (
          <div key={i} className="grid grid-cols-[4.5rem_1fr_auto] gap-2 items-center">
            <input
              className={inputCls}
              type="number"
              min={1}
              max={20}
              aria-label="Hệ số"
              value={a.coefficients[offset + i] ?? 1}
              onChange={(e) =>
                onChange({ ...a, coefficients: a.coefficients.map((c, j) => (j === offset + i ? Math.max(1, Math.round(Number(e.target.value) || 1)) : c)) })
              }
            />
            <input className={inputCls} value={f} placeholder="Ví dụ: Fe2O3" onChange={(e) => setSide(side, values.map((x, j) => (j === i ? e.target.value : x)))} />
            <RemoveBtn label="Xóa chất" disabled={values.length <= 1} onClick={() => setSide(side, values.filter((_, j) => j !== i))} />
          </div>
        ))}
        <button type="button" className={addBtn} onClick={() => setSide(side, [...values, ''])}>
          <Plus className="w-3.5 h-3.5" /> Thêm chất
        </button>
      </div>
    );
  };
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        Học sinh cần
        <select
          className={`${inputCls} w-auto`}
          value={a.mode}
          onChange={(e) => onChange({ ...a, mode: e.target.value as typeof a.mode })}
        >
          <option value="fill-coefficients">điền hệ số cân bằng</option>
          <option value="build">viết cả phương trình</option>
        </select>
      </label>
      {sideEditor('reactants', 'Chất tham gia (hệ số đúng · công thức)', 0)}
      {sideEditor('products', 'Sản phẩm', a.reactants.length)}
      <input
        className={inputCls}
        value={a.condition ?? ''}
        placeholder="Điều kiện phản ứng (không bắt buộc), ví dụ: t°"
        onChange={(e) => onChange({ ...a, condition: e.target.value })}
      />
      {warning && <p className="text-xs font-bold text-[var(--warn-fg)]">{warning}</p>}
    </div>
  );
};
