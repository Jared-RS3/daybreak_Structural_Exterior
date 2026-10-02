"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * A text field that suggests towns and cities worldwide as you type, from
 * /api/places. It's a WAI-ARIA combobox: arrow keys move through the
 * suggestions, Enter picks one, Escape closes the list. Anything typed is
 * still accepted, so a town the list doesn't know never blocks the form.
 */
export function PlaceInput({
  id,
  name,
  className,
  invalid,
  describedBy,
  placeholder,
}: {
  id: string;
  name: string;
  className: string;
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const picked = useRef<string | null>(null);
  const listId = `${id}-list`;

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2 || q === picked.current) {
      setOptions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        // `v` changes whenever the search does, so day-old cached answers aren't reused.
        const res = await fetch(`/api/places?v=2&q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const json = (await res.json()) as { places?: string[] };
        setOptions(json.places ?? []);
        setActive(-1);
        setOpen(true);
      } catch {
        // Aborted or offline: the field keeps working as plain text.
      }
    }, 120);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  const choose = (place: string) => {
    picked.current = place;
    setValue(place);
    setOptions([]);
    setOpen(false);
  };

  const showing = open && options.length > 0;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showing) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + options.length) % options.length);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showing}
        aria-controls={listId}
        aria-activedescendant={showing && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        spellCheck={false}
        maxLength={100}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          picked.current = null;
          setValue(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={className}
      />
      <ul
        id={listId}
        role="listbox"
        aria-label="Suggested towns and cities"
        hidden={!showing}
        className="absolute inset-x-0 top-full z-20 mt-1 border border-rule bg-white py-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)]"
      >
        {options.map((o, i) => (
          <li
            key={o}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            // mousedown, not click: it fires before the input's blur closes the list.
            onMouseDown={(e) => {
              e.preventDefault();
              choose(o);
            }}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-[16px] text-fg",
              i === active && "bg-panel",
            )}
          >
            <Icon name="pin" className="size-4 shrink-0 text-muted" />
            {o}
          </li>
        ))}
      </ul>
    </div>
  );
}
