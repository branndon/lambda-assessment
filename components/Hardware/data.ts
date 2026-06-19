export interface Product {
  id:          number;
  title:       string;
  description: string;
  image:       string;
}

export const PRODUCTS: Product[] = [
  {
    id:          1,
    title:       'NVIDIA VR200 NVL72',
    description: 'Rack-scale systems optimized for agentic AI.',
    image:       'https://lambda.ai/hubfs/VR200.jpg',
  },
  {
    id:          2,
    title:       'NVIDIA GB300 NVL72',
    description: 'Rack-scale systems optimized for AI reasoning',
    image:       'https://lambda.ai/hubfs/gb300.png',
  },
  {
    id:          3,
    title:       'NVIDIA HGX B300',
    description: 'Peak performance per watt for the largest training runs',
    image:       'https://lambda.ai/hubfs/NVIDIA%20HGX%20B300%20(1).png',
  },
  {
    id:          4,
    title:       'NVIDIA HGX B200',
    description: 'Versatile fine-tuning and inference',
    image:       'https://lambda.ai/hubfs/b200.png',
  },
];
