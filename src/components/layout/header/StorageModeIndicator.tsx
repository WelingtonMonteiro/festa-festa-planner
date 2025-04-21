
import { DataSource } from "@/services/unifiedKitService";

interface StorageModeIndicatorProps {
  dataSource: DataSource;
  apiUrl?: string;
}

const StorageModeIndicator = ({ dataSource, apiUrl }: StorageModeIndicatorProps) => {
  let label = 'Local Storage';
  let description = apiUrl || '';

  if (dataSource === 'supabase') {
    label = 'Supabase';
  } else if (dataSource === 'apiRest') {
    label = 'API REST';
  }

  return (
    <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
      {label}{description ? `: ${description}` : ''}
    </div>
  );
};

export default StorageModeIndicator;
