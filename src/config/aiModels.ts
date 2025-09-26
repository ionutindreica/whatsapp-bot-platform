export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'open-source' | 'commercial';
  size: string;
  accuracy: number;
  speed: number;
  cost: 'free' | 'low' | 'medium' | 'high';
  description: string;
  useCases: string[];
  requirements: {
    gpu: boolean;
    ram: string;
    storage: string;
  };
}

export const aiModels: AIModel[] = [
  // Open Source Models
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    type: 'open-source',
    size: '8B parameters',
    accuracy: 85,
    speed: 90,
    cost: 'free',
    description: 'Fast and efficient open-source model, great for general conversations',
    useCases: ['Customer Support', 'General Chat', 'Content Generation'],
    requirements: {
      gpu: false,
      ram: '8GB',
      storage: '16GB'
    }
  },
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    type: 'open-source',
    size: '70B parameters',
    accuracy: 95,
    speed: 60,
    cost: 'free',
    description: 'High-quality open-source model with excellent reasoning capabilities',
    useCases: ['Complex Reasoning', 'Technical Support', 'Code Generation'],
    requirements: {
      gpu: true,
      ram: '32GB',
      storage: '140GB'
    }
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    type: 'open-source',
    size: '7B parameters',
    accuracy: 88,
    speed: 95,
    cost: 'free',
    description: 'Lightweight and fast model, perfect for real-time interactions',
    useCases: ['Real-time Chat', 'Quick Responses', 'Mobile Apps'],
    requirements: {
      gpu: false,
      ram: '6GB',
      storage: '14GB'
    }
  },
  {
    id: 'qwen-2.5-7b',
    name: 'Qwen 2.5 7B',
    provider: 'Alibaba',
    type: 'open-source',
    size: '7B parameters',
    accuracy: 87,
    speed: 92,
    cost: 'free',
    description: 'Multilingual model with excellent performance across languages',
    useCases: ['Multilingual Support', 'Global Chat', 'Translation'],
    requirements: {
      gpu: false,
      ram: '8GB',
      storage: '14GB'
    }
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    provider: 'Microsoft',
    type: 'open-source',
    size: '3.8B parameters',
    accuracy: 82,
    speed: 98,
    cost: 'free',
    description: 'Ultra-lightweight model for edge devices and mobile',
    useCases: ['Mobile Chat', 'Edge Computing', 'IoT Devices'],
    requirements: {
      gpu: false,
      ram: '4GB',
      storage: '8GB'
    }
  },
  {
    id: 'gemma-2-9b',
    name: 'Gemma 2 9B',
    provider: 'Google',
    type: 'open-source',
    size: '9B parameters',
    accuracy: 89,
    speed: 88,
    cost: 'free',
    description: 'Google\'s open-source model with strong performance',
    useCases: ['Research', 'Education', 'Development'],
    requirements: {
      gpu: false,
      ram: '12GB',
      storage: '18GB'
    }
  },

  // Commercial Models
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    type: 'commercial',
    size: '1.76T parameters',
    accuracy: 98,
    speed: 70,
    cost: 'high',
    description: 'Most advanced commercial model with exceptional reasoning',
    useCases: ['Complex Analysis', 'Creative Writing', 'Research'],
    requirements: {
      gpu: false,
      ram: '0GB',
      storage: '0GB'
    }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    type: 'commercial',
    size: 'Unknown',
    accuracy: 97,
    speed: 65,
    cost: 'high',
    description: 'Anthropic\'s most capable model for complex tasks',
    useCases: ['Complex Reasoning', 'Analysis', 'Creative Tasks'],
    requirements: {
      gpu: false,
      ram: '0GB',
      storage: '0GB'
    }
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    type: 'commercial',
    size: 'Unknown',
    accuracy: 96,
    speed: 75,
    cost: 'medium',
    description: 'Google\'s advanced multimodal model',
    useCases: ['Multimodal Tasks', 'Analysis', 'Research'],
    requirements: {
      gpu: false,
      ram: '0GB',
      storage: '0GB'
    }
  }
];

export const getModelById = (id: string): AIModel | undefined => {
  return aiModels.find(model => model.id === id);
};

export const getModelsByType = (type: 'open-source' | 'commercial'): AIModel[] => {
  return aiModels.filter(model => model.type === type);
};

export const getRecommendedModels = (useCase: string): AIModel[] => {
  return aiModels.filter(model => 
    model.useCases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
  );
};
