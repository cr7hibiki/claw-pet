import { PetDisplay } from './PetDisplay';

interface PetDisplayProps {
  modelPath?: string;
  modelName?: string;
}

export function Live2DPetDisplay({ modelPath = '/models/Haru', modelName = 'Haru' }: PetDisplayProps) {
  return <PetDisplay modelPath={modelPath} modelName={modelName} />;
}
