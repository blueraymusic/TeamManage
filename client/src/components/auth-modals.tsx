import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { t } from "@/lib/i18n";
import { Crown, User, X, Rocket, Users } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const adminRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  organizationName: z.string().min(3, "Organization name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const officerRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  organizationCode: z.string().min(5, "Organization code is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface AuthModalsProps {
  showModal: "login" | "register" | null;
  onClose: () => void;
}

export default function AuthModals({ showModal, onClose }: AuthModalsProps) {
  const [registrationType, setRegistrationType] = useState<"admin" | "officer">("admin");
  const { toast } = useToast();
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const adminRegisterForm = useForm({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
      password: "",
    },
  });

  const officerRegisterForm = useForm({
    resolver: zodResolver(officerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      organizationCode: "",
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Login failed",
          variant: "destructive",
        });
      },
    });
  };

  const handleAdminRegister = (data: z.infer<typeof adminRegisterSchema>) => {
    registerMutation.mutate(
      { type: "admin", ...data },
      {
        onSuccess: (response) => {
          toast({
            title: "Success",
            description: `Organization created! Your code is: ${response.organization?.code}`,
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Registration failed",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleOfficerRegister = (data: z.infer<typeof officerRegisterSchema>) => {
    registerMutation.mutate(
      { type: "officer", ...data },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Successfully joined organization!",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Registration failed",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={showModal === "login"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="mb-2">{t('auth.welcomeBack')}</div>
              <p className="text-sm font-normal text-gray-600">{t('auth.signInSubtitle')}</p>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                {...loginForm.register("email")}
                className="mt-1"
                placeholder="Enter your email"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                {...loginForm.register("password")}
                className="mt-1"
                placeholder="Enter your password"
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-600">{t('auth.rememberMe')}</span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                {t('auth.forgotPassword')}
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : t('auth.signIn')}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-gray-600">
              {t('auth.dontHaveAccount')}
              <button 
                className="text-blue-500 hover:text-blue-600 font-medium ml-1"
                onClick={() => {
                  onClose();
                  setTimeout(() => window.dispatchEvent(new CustomEvent('showRegisterModal')), 100);
                }}
              >
                {t('auth.signUpHere')}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={showModal === "register"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="mb-2">{t('auth.getStarted')}</div>
              <p className="text-sm font-normal text-gray-600">{t('auth.chooseType')}</p>
            </DialogTitle>
          </DialogHeader>
          
          {/* Registration Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card 
              className={`cursor-pointer transition-colors ${
                registrationType === "admin" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 hover:border-blue-500"
              }`}
              onClick={() => setRegistrationType("admin")}
            >
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="font-bold">{t('auth.admin')}</div>
                <div className="text-sm text-gray-600">{t('auth.adminDesc')}</div>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-colors ${
                registrationType === "officer" 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 hover:border-green-500"
              }`}
              onClick={() => setRegistrationType("officer")}
            >
              <CardContent className="p-4 text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="font-bold">{t('auth.officer')}</div>
                <div className="text-sm text-gray-600">{t('auth.officerDesc')}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Admin Registration Form */}
          {registrationType === "admin" && (
            <form onSubmit={adminRegisterForm.handleSubmit(handleAdminRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminFirstName">{t('auth.firstName')}</Label>
                  <Input
                    id="adminFirstName"
                    {...adminRegisterForm.register("firstName")}
                    className="mt-1"
                    placeholder="John"
                  />
                  {adminRegisterForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {adminRegisterForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="adminLastName">{t('auth.lastName')}</Label>
                  <Input
                    id="adminLastName"
                    {...adminRegisterForm.register("lastName")}
                    className="mt-1"
                    placeholder="Doe"
                  />
                  {adminRegisterForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {adminRegisterForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="organizationName">{t('auth.organizationName')}</Label>
                <Input
                  id="organizationName"
                  {...adminRegisterForm.register("organizationName")}
                  className="mt-1"
                  placeholder="Your NGO Name"
                />
                {adminRegisterForm.formState.errors.organizationName && (
                  <p className="text-sm text-red-500 mt-1">
                    {adminRegisterForm.formState.errors.organizationName.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="adminEmail">{t('auth.email')}</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  {...adminRegisterForm.register("email")}
                  className="mt-1"
                  placeholder="admin@ngo.org"
                />
                {adminRegisterForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {adminRegisterForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="adminPassword">{t('auth.password')}</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  {...adminRegisterForm.register("password")}
                  className="mt-1"
                  placeholder="Create secure password"
                />
                {adminRegisterForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {adminRegisterForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={registerMutation.isPending}
              >
                <Rocket className="w-4 h-4 mr-2" />
                {registerMutation.isPending ? "Creating..." : t('auth.createOrganization')}
              </Button>
            </form>
          )}
          
          {/* Officer Registration Form */}
          {registrationType === "officer" && (
            <form onSubmit={officerRegisterForm.handleSubmit(handleOfficerRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="officerFirstName">{t('auth.firstName')}</Label>
                  <Input
                    id="officerFirstName"
                    {...officerRegisterForm.register("firstName")}
                    className="mt-1"
                    placeholder="Jane"
                  />
                  {officerRegisterForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {officerRegisterForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="officerLastName">{t('auth.lastName')}</Label>
                  <Input
                    id="officerLastName"
                    {...officerRegisterForm.register("lastName")}
                    className="mt-1"
                    placeholder="Smith"
                  />
                  {officerRegisterForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {officerRegisterForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="organizationCode">{t('auth.organizationCode')}</Label>
                <Input
                  id="organizationCode"
                  {...officerRegisterForm.register("organizationCode")}
                  className="mt-1 font-mono"
                  placeholder="NGO-1234"
                />
                {officerRegisterForm.formState.errors.organizationCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {officerRegisterForm.formState.errors.organizationCode.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="officerEmail">{t('auth.email')}</Label>
                <Input
                  id="officerEmail"
                  type="email"
                  {...officerRegisterForm.register("email")}
                  className="mt-1"
                  placeholder="officer@email.com"
                />
                {officerRegisterForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {officerRegisterForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="officerPassword">{t('auth.password')}</Label>
                <Input
                  id="officerPassword"
                  type="password"
                  {...officerRegisterForm.register("password")}
                  className="mt-1"
                  placeholder="Create secure password"
                />
                {officerRegisterForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {officerRegisterForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={registerMutation.isPending}
              >
                <Users className="w-4 h-4 mr-2" />
                {registerMutation.isPending ? "Joining..." : t('auth.joinOrganization')}
              </Button>
            </form>
          )}
          
          <div className="text-center">
            <p className="text-gray-600">
              {t('auth.alreadyHaveAccount')}
              <button 
                className="text-blue-500 hover:text-blue-600 font-medium ml-1"
                onClick={() => {
                  onClose();
                  setTimeout(() => window.dispatchEvent(new CustomEvent('showLoginModal')), 100);
                }}
              >
                {t('auth.signInHere')}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
