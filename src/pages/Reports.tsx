
import { useState } from 'react';
import { Calendar, Filter, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFestaContext } from '@/contexts/FestaContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientes: clients } = useFestaContext();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [clientFilter, setClientFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("financial");
  
  // Parse URL search params
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type');
  
  // Initialize active tab based on URL parameter or default to financial
  const [activeTab, setActiveTab] = useState(typeParam || "financial");

  const reportTypes = [
    { id: "financial", name: "Financial" },
    { id: "events", name: "Events" },
    { id: "clients", name: "Clients" },
    { id: "kits", name: "Kits & Themes" }
  ];

  // Function to apply filters
  const applyFilters = () => {
    // Construct filter parameters
    const params = new URLSearchParams();
    
    if (startDate) {
      params.append("startDate", format(startDate, "yyyy-MM-dd"));
    }
    
    if (endDate) {
      params.append("endDate", format(endDate, "yyyy-MM-dd"));
    }
    
    if (clientFilter) {
      params.append("client", clientFilter);
    }
    
    params.append("type", activeTab);
    
    // Update URL with filters without navigating
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setTypeFilter(value);
    
    // Update URL when changing tabs
    const params = new URLSearchParams(location.search);
    params.set('type', value);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and generate reports for your business
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Select filters to customize your reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Date Period Filter */}
              <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : <span>End date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Client Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Client</label>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={applyFilters} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Results
            </CardTitle>
            <CardDescription>
              View the results of the selected report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="kits">Kits & Themes</TabsTrigger>
              </TabsList>
              <TabsContent value="financial">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Financial Report</h3>
                  <p className="text-muted-foreground">
                    {startDate && endDate ? 
                      `Financial data from ${format(startDate, "dd/MM/yyyy", { locale: ptBR })} to ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}` : 
                      'Select a period to see specific data'}
                  </p>
                  {/* Financial report content would go here */}
                </div>
              </TabsContent>
              <TabsContent value="events">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Events Report</h3>
                  <p className="text-muted-foreground">
                    {startDate && endDate ? 
                      `Events from ${format(startDate, "dd/MM/yyyy", { locale: ptBR })} to ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}` : 
                      'Select a period to see specific events'}
                  </p>
                  {/* Events report content would go here */}
                </div>
              </TabsContent>
              <TabsContent value="clients">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Clients Report</h3>
                  <p className="text-muted-foreground">
                    {clientFilter ? 'Data for selected client' : 'Select a client to see specific data'}
                  </p>
                  {/* Clients report content would go here */}
                </div>
              </TabsContent>
              <TabsContent value="kits">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-4">Kits & Themes Report</h3>
                  <p className="text-muted-foreground">
                    View data about kits and themes used
                  </p>
                  {/* Kits and themes report content would go here */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
