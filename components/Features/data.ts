export interface FeatureItem {
  id:     number;
  number: string;
  title:  string;
  body:   string;
  locked: boolean;
}

export const ITEMS: FeatureItem[] = [
  {
    id:     1,
    number: '01',
    title:  'You bring models. We bring the compute.',
    body:   'Get complete AI factories integrating high-density power, liquid cooling, and NVIDIA GPUs into one system designed for peak AI performance.',
    locked: true,
  },
  {
    id:     2,
    number: '02',
    title:  'Your supercomputer. Your rules.',
    body:   'Accelerate every stage of your AI lifecycle. Train foundation models and serve billions of tokens.',
    locked: false,
  },
  {
    id:     3,
    number: '03',
    title:  'Orchestration, handled.',
    body:   'Run large-scale AI workloads without the operational burden. We manage your clusters so you can focus on innovation.',
    locked: false,
  },
  {
    id:     4,
    number: '04',
    title:  'Experts included.',
    body:   "Co-engineer your workloads with the very people building the infrastructure behind the world's most advanced models.",
    locked: false,
  },
];
