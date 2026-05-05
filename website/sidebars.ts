import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'introduction',
    'quick-start',
    'repositories',
    'transactions',
    'testing',
    {
      type: 'category',
      label: 'Support & Reference',
      items: [
        'support-policy',
        'api-reference',
        'quality-and-ci',
        'contributing',
        'roadmap',
      ],
    },
  ],
};

export default sidebars;
