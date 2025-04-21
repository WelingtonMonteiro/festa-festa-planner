
import { 
  UserPlus, 
  PhoneCall, 
  Clock, 
  Check, 
  X 
} from "lucide-react";
import { LeadStatus } from "@/types/leads";

export const getStatusColor = (status: LeadStatus) => {
  switch (status) {
    case 'novo':
      return "bg-blue-500 hover:bg-blue-600";
    case 'contato':
      return "bg-yellow-500 hover:bg-yellow-600";
    case 'negociando':
      return "bg-purple-500 hover:bg-purple-600";
    case 'convertido':
      return "bg-green-500 hover:bg-green-600";
    case 'perdido':
      return "bg-red-500 hover:bg-red-600";
    default:
      return "";
  }
};

export const getStatusIcon = (status: LeadStatus) => {
  switch (status) {
    case 'novo':
      return <UserPlus className="h-4 w-4" />;
    case 'contato':
      return <PhoneCall className="h-4 w-4" />;
    case 'negociando':
      return <Clock className="h-4 w-4" />;
    case 'convertido':
      return <Check className="h-4 w-4" />;
    case 'perdido':
      return <X className="h-4 w-4" />;
    default:
      return null;
  }
};
