import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  Building2,
  Target,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  GraduationCap,
  Wrench,
  BookOpen,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [isEligibilityDialogOpen, setIsEligibilityDialogOpen] = useState(false);
  const [eligibilityFormData, setEligibilityFormData] = useState({
    institutionType: "",
    engineeringField: "",
    sportsType: "",
    sportsLevel: "",
    cgpa: "",
  });
  const [eligibilityResult, setEligibilityResult] = useState({
    isEligible: false,
    message: "",
    details: "",
    scholarshipType: "",
  });

  // Eligibility check form handlers
  const handleEligibilityChange = (field: string) => (value: string) => {
    setEligibilityFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point, max 4 chars (e.g., "9.95")
    if (!/^\d*\.?\d*$/.test(value) || value.length > 4) return;
    
    setEligibilityFormData((prev) => ({
      ...prev,
      cgpa: value,
    }));
  };

  const checkEligibility = () => {
    const { institutionType, engineeringField, sportsType, sportsLevel, cgpa } = eligibilityFormData;
    
    // Validate form
    if (!institutionType || !engineeringField || !sportsType || !sportsLevel || !cgpa) {
      setEligibilityResult({
        isEligible: false,
        message: "Please fill all the required fields",
        details: "All fields are required to check your eligibility.",
        scholarshipType: "",
      });
      setIsEligibilityDialogOpen(true);
      return;
    }

    // Parse CGPA to number
    const cgpaNum = parseFloat(cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      setEligibilityResult({
        isEligible: false,
        message: "Invalid CGPA",
        details: "CGPA must be a number between 0 and 10.",
        scholarshipType: "",
      });
      setIsEligibilityDialogOpen(true);
      return;
    }

    // Determine eligibility based on criteria
    let isEligible = true;
    let message = "Congratulations! You are eligible for the scholarship.";
    let details = "";
    let scholarshipType = "";

    // Check minimum CGPA requirements based on institution type
    let minimumCGPA = 7.0; // Default minimum
    if (institutionType === "iit" || institutionType === "nit") {
      minimumCGPA = 7.5;
    } else if (institutionType === "iiit" || institutionType === "government") {
      minimumCGPA = 8.0;
    } else if (institutionType === "private" || institutionType === "deemed" || institutionType === "other") {
      minimumCGPA = 7.5;
    }

    // Check if CGPA meets the minimum requirement
    if (cgpaNum < minimumCGPA) {
      isEligible = false;
      message = "Sorry, you are not eligible for the scholarship.";
      details = `Your CGPA (${cgpaNum}) is below the minimum requirement (${minimumCGPA}) for your institution type.`;
    } 
    // If eligible, determine scholarship type
    else {
      // Determine scholarship type based on institution
      if (institutionType === "iit") {
        scholarshipType = "Premium IIT Scholarship (₹5,00,000 - ₹7,50,000 per year)";
      } else if (institutionType === "nit") {
        scholarshipType = "Elite NIT Scholarship (₹3,50,000 - ₹5,00,000 per year)";
      } else if (institutionType === "iiit" || institutionType === "government") {
        scholarshipType = "Government Institute Scholarship (₹2,50,000 - ₹3,50,000 per year)";
      } else {
        scholarshipType = "Standard Scholarship (₹1,50,000 - ₹2,50,000 per year)";
      }

      // Extra bonus for national/international level sports
      if (sportsLevel === "national" || sportsLevel === "international") {
        details = `You qualify for the ${scholarshipType}. Your ${sportsLevel}-level sports achievement in ${sportsType} gives you priority consideration.`;
      } else {
        details = `You qualify for the ${scholarshipType}. We encourage you to highlight your sports achievements in ${sportsType} in your application.`;
      }
    }

    setEligibilityResult({
      isEligible,
      message,
      details,
      scholarshipType,
    });
    setIsEligibilityDialogOpen(true);
  };

  const features = [
    {
      icon: Target,
      title: "Academic Excellence",
      description:
        "Merit-based scholarships for outstanding engineering students pursuing technical education in various disciplines.",
    },
    {
      icon: Wrench,
      title: "Industry Integration",
      description:
        "Direct pathways to careers with Engineers India Limited and partner organizations in the engineering sector.",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Access to international engineering programs and collaborative projects with leading technical institutions worldwide.",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Support",
      description:
        "Mentorship, career guidance, and professional development throughout your engineering education journey.",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      field: "Chemical Engineering",
      university: "IIT Delhi",
      quote:
        "The EIL scholarship program transformed my career. I'm now working on cutting-edge projects in process engineering.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      field: "Civil Engineering",
      university: "NIT Trichy",
      quote:
        "Thanks to EIL's support, I completed my Masters in Infrastructure Engineering and joined their project management team.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      field: "Mechanical Engineering",
      university: "BITS Pilani",
      quote:
        "The mentorship and financial support helped me focus on my studies. Now I'm contributing to major industrial projects.",
      rating: 5,
    },
  ];

  const process = [
    {
      step: "01",
      title: "Eligibility Check",
      description:
        "Verify your academic credentials, engineering program enrollment, and meet the minimum GPA requirements.",
    },
    {
      step: "02",
      title: "Application Submit",
      description:
        "Complete the comprehensive application including academic records, project portfolio, and personal statement.",
    },
    {
      step: "03",
      title: "Evaluation Process",
      description:
        "Our technical committee reviews applications based on academic merit, project work, and career potential.",
    },
    {
      step: "04",
      title: "Join EIL Family",
      description:
        "Receive scholarship funding, mentorship assignment, and potential internship opportunities with Engineers India Limited.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-20 lg:py-32"
        style={{ backgroundImage: "url('https://github.com/Kushcodingexe/sports-scholarship_eil_internship/blob/main/src/pages/edit%20eil%20ggn.jpg?raw=true')" }}
      >
        {/* Dark transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

        {/* Actual content */}
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
              Sports Excellence Meets
              <span className="text-primary"> Educational Opportunity</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white max-w-2xl mx-auto">
              Engineers India Limited proudly supports exceptional engineering
              students through comprehensive scholarship programs and career
              development opportunities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/apply">
                  Apply for Scholarship <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Checker Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-3">
                Check Your Eligibility
              </h2>
              <p className="text-lg text-muted-foreground">
                Find out if you qualify for our scholarship program before applying.
              </p>
            </div>
            
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Scholarship Eligibility Checker
                </CardTitle>
                <CardDescription>
                  Fill in the details below to check your scholarship eligibility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="institutionType">Institution Type *</Label>
                    <Select onValueChange={handleEligibilityChange("institutionType")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your institution type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iit">Indian Institute of Technology (IIT)</SelectItem>
                        <SelectItem value="nit">National Institute of Technology (NIT)</SelectItem>
                        <SelectItem value="iiit">Indian Institute of Information Technology (IIIT)</SelectItem>
                        <SelectItem value="government">Government Engineering College</SelectItem>
                        <SelectItem value="private">Private Engineering College</SelectItem>
                        <SelectItem value="deemed">Deemed University</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="engineeringField">Engineering Field *</Label>
                    <Select onValueChange={handleEligibilityChange("engineeringField")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer_science">Computer Science & Engineering</SelectItem>
                        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                        <SelectItem value="electrical">Electrical Engineering</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                        <SelectItem value="electronics">Electronics & Communication</SelectItem>
                        <SelectItem value="chemical">Chemical Engineering</SelectItem>
                        <SelectItem value="aerospace">Aerospace Engineering</SelectItem>
                        <SelectItem value="biotechnology">Biotechnology</SelectItem>
                        <SelectItem value="other">Other Engineering Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">Current CGPA (Out of 10) *</Label>
                    <Input
                      value={eligibilityFormData.cgpa}
                      onChange={handleCGPAChange}
                      placeholder="e.g., 8.5"
                      className="max-w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sportsType">Sports Type *</Label>
                    <Select onValueChange={handleEligibilityChange("sportsType")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sports type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cricket">Cricket</SelectItem>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="hockey">Hockey</SelectItem>
                        <SelectItem value="badminton">Badminton</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="tabletennis">Table Tennis</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="athletics">Athletics</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                        <SelectItem value="chess">Chess</SelectItem>
                        <SelectItem value="other">Other Sport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="sportsLevel">Highest Level of Sports Achievement *</Label>
                    <Select onValueChange={handleEligibilityChange("sportsLevel")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your highest achievement level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="institutional">Institutional Level</SelectItem>
                        <SelectItem value="district">District Level</SelectItem>
                        <SelectItem value="state">State Level</SelectItem>
                        <SelectItem value="national">National Level</SelectItem>
                        <SelectItem value="international">International Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={checkEligibility} 
                    className="w-full md:w-auto bg-primary hover:bg-primary/90"
                  >
                    Check Eligibility <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Eligibility Result Dialog */}
            <Dialog open={isEligibilityDialogOpen} onOpenChange={setIsEligibilityDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {eligibilityResult.isEligible ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span>Eligibility Confirmed</span>
                      </>
                    ) : (
                      <>
                        <Info className="h-5 w-5 text-amber-500" />
                        <span>Eligibility Result</span>
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {eligibilityResult.message}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="p-4 bg-gray-50 border rounded-md mt-2">
                  <p className="text-gray-800">{eligibilityResult.details}</p>
                  
                  {eligibilityResult.isEligible && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800 font-medium">Scholarship Type:</p>
                      <p className="text-green-700">{eligibilityResult.scholarshipType}</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="sm:justify-center gap-2 mt-4">
                  {eligibilityResult.isEligible ? (
                    <>
                      <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                        <Link to="/apply">
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsEligibilityDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => setIsEligibilityDialogOpen(false)}
                    >
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Why Choose EIL Scholar?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Supporting engineering students with comprehensive scholarship
              programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-900">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple steps to apply for your scholarship.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-6">
                    <span className="text-xl font-bold text-primary-foreground">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - EIL Style */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="container">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* EIL Logo on the left */}
            <div className="flex-shrink-0 mr-16">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6638b6e3f08849eb91b735b1c7b57266%2F8acc8f463f504829a092660b0a2175c8?format=webp&width=800"
                  alt="Engineers India Limited Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>

            {/* Content on the right */}
            <div className="flex-1 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-lg mx-auto">
                Apply for engineering scholarships with Engineers India Limited.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-base font-semibold shadow-lg"
              >
                <Link to="/apply">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6638b6e3f08849eb91b735b1c7b57266%2F6058fef7c7e349ea9850291fc20c0a96?format=webp&width=800"
                  alt="EIL Scholar Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold">EIL Scholar</span>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; 2025 Engineers India Limited. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
