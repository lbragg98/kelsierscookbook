export default function RulesDraftScaffold() {
  return (
    <section className="panel rules-scaffold" aria-label="Future rules editor scaffold">
      <h3 className="panel__title">Future rules editor</h3>
      <p className="panel__body">
        This is the shape a later edit screen can follow when you want the College of Cuisine to become
        editable in the same journal style as recipes and ingredients.
      </p>

      <div className="rules-scaffold__grid" aria-hidden="true">
        <div className="rules-scaffold__field">
          <span className="rules-scaffold__label">Section title</span>
          <div className="rules-scaffold__slot" />
        </div>
        <div className="rules-scaffold__field">
          <span className="rules-scaffold__label">Rule body</span>
          <div className="rules-scaffold__slot rules-scaffold__slot--tall" />
        </div>
        <div className="rules-scaffold__field">
          <span className="rules-scaffold__label">Reference notes</span>
          <div className="rules-scaffold__slot rules-scaffold__slot--tall" />
        </div>
      </div>
    </section>
  );
}
