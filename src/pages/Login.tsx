import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smartphone, Lock } from "lucide-react";
import smjLogo from "@/assets/smj-logo.png";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateFields = () => {
    if (!mobileNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Mobile number is required",
      });
      return false;
    }
    
    // Validate mobile number - must be exactly 10 digits
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNumber.trim())) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Mobile number must be exactly 10 digits",
      });
      return false;
    }
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error", 
        description: "Password is required",
      });
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://smjuthangarai.in/RestApi/restApiPHP.php?option=LoginVerifyCustomer&mobileNumber=${encodeURIComponent(mobileNumber)}&password=${encodeURIComponent(password)}`
      );
      
      const data = await response.json();
      
      if (data.status === "success" || data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to SMJ!",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: data.message || "Invalid mobile number or password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-elegant)] border-border/50">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <img 
              src={smjLogo} 
              alt="SMJ Logo" 
              className="w-20 h-20 rounded-full shadow-[var(--shadow-gold)]"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SMJ
            </h1>
            <p className="text-muted-foreground mt-2">Welcome back</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-foreground font-medium">
              Mobile Number
            </Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => {
                  // Only allow digits and limit to 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(value);
                }}
                className="pl-10 h-12 border-border/60 focus:border-primary"
                disabled={isLoading}
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 border-border/60 focus:border-primary"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
              />
            </div>
          </div>

          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-[var(--shadow-gold)] transition-all duration-300 hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;