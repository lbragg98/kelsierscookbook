type SelectionListItem = {
  id: string;
  primary: string;
  secondary: string;
};

export default function SelectionList({
  items,
  activeId,
  onSelect,
  ariaLabel,
}: {
  items: SelectionListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  ariaLabel: string;
}) {
  return (
    <section className="panel selection-list" aria-label={ariaLabel}>
      <h3 className="panel__title">{ariaLabel}</h3>
      <ul className="selection-list__items">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <button
                type="button"
                className="selection-list__item"
                data-active={isActive}
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="selection-list__name">{item.primary}</span>
                <span className="selection-list__meta">{item.secondary}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
