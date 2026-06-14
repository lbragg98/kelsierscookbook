import { collegeOfCuisineFeatures, collegeOfCuisineIntro } from './collegeOfCuisine';

export default function RulesPage() {
  return (
    <>
      <section className="panel" aria-label="College of Cuisine overview">
        <h3 className="panel__title">Overview</h3>
        <div className="rules-copy">
          {collegeOfCuisineIntro.map((paragraph) => (
            <p key={paragraph} className="rules-copy__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {collegeOfCuisineFeatures.map((feature) => (
        <section key={`${feature.level}-${feature.title}`} className="panel" aria-label={`${feature.level} ${feature.title}`}>
          <h3 className="panel__title">
            {feature.level}: {feature.title}
          </h3>

          <div className="rules-copy">
            {feature.summary.map((paragraph) => (
              <p key={paragraph} className="rules-copy__paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {feature.bullets ? (
            <ul className="rules-list">
              {feature.bullets.map((bullet) => (
                <li key={bullet} className="rules-list__item">
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}

          {feature.flavorNotes ? (
            <div className="rules-flavors" aria-label="Petit Fours flavors">
              {feature.flavorNotes.map((note) => {
                const [label, detail] = note.split(': ');

                return (
                  <p key={note} className="rules-flavors__item">
                    <strong>{label}.</strong> {detail}
                  </p>
                );
              })}
            </div>
          ) : null}
        </section>
      ))}

    </>
  );
}
