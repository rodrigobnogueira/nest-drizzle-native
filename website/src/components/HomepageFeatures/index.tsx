import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Nest Module Setup',
    icon: 'Module',
    description: (
      <>
        Register Drizzle clients through forRoot or forRootAsync and inject them
        with the same provider patterns used across Nest applications.
      </>
    ),
  },
  {
    title: 'Repository Classes',
    icon: 'Repo',
    description: (
      <>
        Keep query code in plain provider classes with explicit Drizzle calls,
        without replacing Drizzle schemas, SQL templates, or type inference.
      </>
    ),
  },
  {
    title: 'Named Connections',
    icon: 'DB',
    description: (
      <>
        Register multiple Drizzle clients for operational, analytics, tenant, or
        migration use cases while keeping injection explicit.
      </>
    ),
  },
  {
    title: 'CLS Transactions',
    icon: 'Tx',
    description: (
      <>
        Bridge transaction decorators to the established nestjs-cls
        transactional stack instead of adding another context implementation.
      </>
    ),
  },
  {
    title: 'Zero Runtime Dependencies',
    icon: 'Zero',
    description: (
      <>
        The published package keeps runtime dependencies empty. Nest, Drizzle,
        drivers, and optional tools stay under the host application's control.
      </>
    ),
  },
  {
    title: 'Tested With Real Drizzle',
    icon: 'Test',
    description: (
      <>
        The package suite exercises real libSQL, better-sqlite3, PostgreSQL,
        and MySQL clients, plus CLS-backed commit and rollback coverage.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md feature-card">
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
