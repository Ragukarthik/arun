import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import smjLogo from "@/assets/smj-logo.png";

interface PriceData {
  "1gramPrice"?: string;
  "8gramPrice"?: string;
  "1silverPrice"?: string;
  success?: boolean;
  message?: string;
}

const Dashboard = () => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPrices = async () => {
    try {
      const response = await fetch(
        "https://smjuthangarai.in/RestApi/restApiPHP.php?option=PriceListToday"
      );
      const data = await response.json();
      
      setPriceData(data);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching prices",
        description: "Unable to load current prices. Please try again.",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Set up auto-refresh every 10 minutes (600,000 ms)
    const interval = setInterval(fetchPrices, 600000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return "N/A";
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getGoldPrice1g = () => {
    return priceData?.["1gramPrice"];
  };

  const getGoldPrice8g = () => {
    return priceData?.["8gramPrice"];
  };

  const getSilverPrice1g = () => {
    return priceData?.["1silverPrice"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={smjLogo} 
              alt="SMJ Logo" 
              className="w-10 h-10 rounded-full shadow-[var(--shadow-gold)]"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SMJ Dashboard
              </h1>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={fetchPrices}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="border-border/60"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-border/60 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Price Cards */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1 Gram Gold Price */}
          <Card className="shadow-[var(--shadow-elegant)] border-border/50 hover:shadow-lg transition-all duration-300 bg-card/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                  Gold (1g)
                </span>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-secondary"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  <span className="ml-2 text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(getGoldPrice1g())}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Per gram</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 8 Gram Gold Price */}
          <Card className="shadow-[var(--shadow-elegant)] border-border/50 hover:shadow-lg transition-all duration-300 bg-card/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                  Gold (8g)
                </span>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-secondary"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  <span className="ml-2 text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(getGoldPrice8g())}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">8 grams total</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 1 Gram Silver Price */}
          <Card className="shadow-[var(--shadow-elegant)] border-border/50 hover:shadow-lg transition-all duration-300 bg-card/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
                  Silver (1g)
                </span>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-muted-foreground to-border"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {formatPrice(getSilverPrice1g())}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Per gram</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Auto-refresh info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Prices update automatically every 10 minutes
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;