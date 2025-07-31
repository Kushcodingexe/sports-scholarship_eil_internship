import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon, FileText, Award, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import ApplicationStatusNotification from "@/components/ApplicationStatusNotification";
import { useAuth } from "@/lib/AuthContext";
import applicationService from "@/lib/api/applicationService";
import { Skeleton } from "@/components/ui/skeleton";

const Download = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingApproval, setIsGeneratingApproval] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (!user) {
          setLoading(false);
          return;
        }
        const data = await applicationService.getUserApplications(user.id);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  // Get approved applications
  const getApprovedApplications = () => {
    return applications.filter(app => app.status === 'approved');
  };
  
  const approvedApplications = getApprovedApplications();

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      // Get form data from localStorage (saved from Apply page)
      const savedFormData = localStorage.getItem("eilApplicationData");
      const formData = savedFormData ? JSON.parse(savedFormData) : {};

      const pdf = new jsPDF();
      // Function to draw border on a given page
      const drawBorder = () => {
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        // Outer Black Border
        pdf.setDrawColor(0); // Black
        pdf.setLineWidth(1.5);
        pdf.rect(5, 5, width - 10, height - 10);

        // Inner Blue Border
        pdf.setDrawColor(0, 0, 255); // RGB Blue
        pdf.setLineWidth(0.75);
        pdf.rect(10, 10, width - 20, height - 20);
      };
      drawBorder(); // draw border on first page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("EIL SCHOLARSHIP APPLICATION", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 20;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Engineers India Limited", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 30;

      // Personal Information Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("PERSONAL INFORMATION", margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const personalInfo = [
        [
          "Full Name:",
          `${formData.title || ""} ${formData.firstName || ""} ${formData.middleName || ""} ${formData.lastName || ""}`.trim() ||
            "Not provided",
        ],
        ["Father's Name:", formData.fatherName || "Not provided"],
        ["Mother's Name:", formData.motherName || "Not provided"],
        ["Date of Birth:", formData.dateOfBirth || "Not provided"],
        ["Mobile Number:", formData.mobileNumber || "Not provided"],
        ["Email ID:", formData.emailId || "Not provided"],
        ["Address:", formData.addressLine1 || "Not provided"],
        ["", formData.addressLine2 || ""],
        [
          "City, State:",
          `${formData.city || ""}, ${formData.state || ""}`.trim() ||
            "Not provided",
        ],
        ["Postal Code:", formData.postalCode || "Not provided"],
        ["National ID:", formData.nationalId || "Not provided"],
      ];

      personalInfo.forEach(([label, value]) => {
        if (label && value) {
          pdf.setFont("helvetica", "bold");
          pdf.text(label, margin, yPosition);
          pdf.setFont("helvetica", "normal");

          // Wrap text if it's too long
          const splitText = pdf.splitTextToSize(value, pageWidth - margin - 60);
          pdf.text(splitText, margin + 50, yPosition);
          yPosition += 12 * Math.max(1, splitText.length);
        }
      });

      yPosition += 10;

      // Academic Information Section
      if (yPosition > pdf.internal.pageSize.getHeight() - 60) {
        pdf.addPage();
        drawBorder(); // draw border on new page
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("ACADEMIC INFORMATION", margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const academicInfo = [
        ["Highest Exam Passed:", formData.highestExamPassed || "Not provided"],
        ["Year of Passing:", formData.yearOfPassing || "Not provided"],
        ["School/University:", formData.schoolUniversityName || "Not provided"],
      ];

      academicInfo.forEach(([label, value]) => {
        if (value !== "Not provided" || !formData.firstName) {
          pdf.setFont("helvetica", "bold");
          pdf.text(label, margin, yPosition);
          pdf.setFont("helvetica", "normal");
          const splitText = pdf.splitTextToSize(value, pageWidth - margin - 60);
          pdf.text(splitText, margin + 60, yPosition);
          yPosition += 12 * Math.max(1, splitText.length);
        }
      });

      yPosition += 10;

      // Engineering Information Section
      if (yPosition > pdf.internal.pageSize.getHeight() - 60) {
        pdf.addPage();
        drawBorder(); // draw border on new page
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("SPORTS ACHIEVEMENTS", margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const engineeringInfo = [
        ["Engineering Field:", formData.engineeringField || "Not provided"],
        ["Sports Type:", formData.projectType || "Not provided"],
        ["Tournament Name:", formData.projectName || "Not provided"],
        ["Position/Level:", formData.positionLevel || "Not provided"],
        ["Result:", formData.resultMetrics || "Not provided"],
        ["Tournament Date:", formData.projectDate || "Not provided"],
      ];

      engineeringInfo.forEach(([label, value]) => {
        if (value !== "Not provided" || !formData.firstName) {
          pdf.setFont("helvetica", "bold");
          pdf.text(label, margin, yPosition);
          pdf.setFont("helvetica", "normal");
          const splitText = pdf.splitTextToSize(value, pageWidth - margin - 50);
          pdf.text(splitText, margin + 50, yPosition);
          yPosition += 12 * Math.max(1, splitText.length);
        }
      });

      // Footer
      yPosition = pdf.internal.pageSize.getHeight() - 30;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        margin,
        yPosition,
      );
      pdf.text(
        "Engineers India Limited - Scholarship Application",
        pageWidth / 2,
        yPosition + 10,
        { align: "center" },
      );

      // Save the PDF
      const fileName = `EIL_Scholarship_Application_${formData.firstName || "Form"}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);

      // Show success message
      alert("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Error generating PDF. Please make sure you've filled out the application form first.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate an official approval letter for approved applications
  const generateApprovalLetter = async (application) => {
    setIsGeneratingApproval(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Add company logo/header
      pdf.setFillColor(0, 83, 156); // EIL blue
      pdf.rect(0, 0, pageWidth, 20, 'F');
      
      pdf.setTextColor(0, 83, 156); // EIL blue
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("ENGINEERS INDIA LIMITED", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.text("Official Scholarship Approval", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 30;

      // Reference Number and Date
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const refNumber = `EIL/SCHOL/${new Date().getFullYear()}/${application.applicationId || application._id.substring(0, 6)}`;
      pdf.text(`Reference: ${refNumber}`, margin, yPosition);
      yPosition += 7;
      
      pdf.text(`Date: ${new Date().toDateString()}`, margin, yPosition);
      yPosition += 20;
      
      // Addressee
      pdf.text(`${application.title || ""} ${application.firstName || ""} ${application.middleName || ""} ${application.lastName || ""} ${application.name}`.trim(), margin, yPosition);
      yPosition += 7;
      if (application.addressLine1) {
        pdf.text(application.addressLine1, margin, yPosition);
        yPosition += 7;
      }
      if (application.addressLine2) {
        pdf.text(application.addressLine2, margin, yPosition);
        yPosition += 7;
      }
      if (application.city || application.state) {
        pdf.text(`${application.city || ""}, ${application.state || ""} ${application.postalCode || ""}`.trim(), margin, yPosition);
        yPosition += 20;
      } else {
        yPosition += 15;
      }
      
      // Subject
      pdf.setFont("helvetica", "bold");
      pdf.text("Subject: Approval of Scholarship Application", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      yPosition += 20;

      // Salutation
      pdf.text("Dear Applicant,", margin, yPosition);
      yPosition += 15;
      
      // Body text
      pdf.setFont("helvetica", "normal");
      const bodyText = [
        "We are pleased to inform you that your application for the EIL Sports Excellence Scholarship has been approved by the scholarship committee.",
        "",
        `Application ID: ${application.applicationId || application._id.substring(0, 8)}`,
        `Category: ${application.institutionType || "Standard"} Scholarship`,
        `Engineering Field: ${application.engineeringField || "Engineering"}`,
        `Sport Category: ${application.sportsType || application.sport || "Sports"}`,
        "",
        "Your academic achievements and sports excellence have been recognized, and you have been selected to receive financial assistance for your education."
      ];
      
      bodyText.forEach(paragraph => {
        if (paragraph === "") {
          yPosition += 7;
        } else {
          const splitText = pdf.splitTextToSize(paragraph, pageWidth - (2 * margin));
          pdf.text(splitText, margin, yPosition);
          yPosition += 7 * Math.max(1, splitText.length);
        }
      });
      
      yPosition += 10;
      
      // Get feedback comment if available
      const getApprovalComment = () => {
        if (!application.comments || application.comments.length === 0) return null;
        
        // Filter comments and safely sort by date
        const approvalComments = application.comments
          .filter(comment => comment.actionType === 'approve')
          .sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA; // descending order
          });
        
        return approvalComments.length > 0 ? approvalComments[0].content : null;
      };
      
      const approvalComment = getApprovalComment();
      if (approvalComment) {
        pdf.setFont("helvetica", "italic");
        pdf.text("Committee Remarks:", margin, yPosition);
        yPosition += 7;
        
        pdf.text(`"${approvalComment}"`, margin + 5, yPosition);
        yPosition += 20;
        pdf.setFont("helvetica", "normal");
      } else {
        yPosition += 10;
      }
      
      // Details of scholarship
      pdf.setFont("helvetica", "bold");
      pdf.text("Scholarship Details:", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      yPosition += 10;
      
      // Create scholarship amount based on institution type
      let scholarshipAmount = "₹1,50,000 - ₹2,50,000";
      if (application.institutionType === 'iit') {
        scholarshipAmount = "₹5,00,000 - ₹7,50,000";
      } else if (application.institutionType === 'nit') {
        scholarshipAmount = "₹3,50,000 - ₹5,00,000";
      } else if (application.institutionType === 'iiit' || application.institutionType === 'government') {
        scholarshipAmount = "₹2,50,000 - ₹3,50,000";
      }
      
      const scholarshipDetails = [
        `Amount: ${scholarshipAmount} per year`,
        "Duration: Academic year 2023-2024",
        "Payment: Disbursed in two equal installments",
        "First installment: Within 30 days of this approval",
        "Second installment: Upon submission of mid-term progress report"
      ];
      
      scholarshipDetails.forEach(detail => {
        pdf.text(`• ${detail}`, margin + 10, yPosition);
        yPosition += 7;
      });
      
      yPosition += 15;
      
      // Next steps
      pdf.setFont("helvetica", "bold");
      pdf.text("Next Steps:", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      yPosition += 10;
      
      const nextSteps = [
        "Submit your bank details through the scholarship portal",
        "Upload your current enrollment verification from your institution",
        "Attend the scholarship orientation program (details to be shared separately)"
      ];
      
      nextSteps.forEach(step => {
        pdf.text(`• ${step}`, margin + 10, yPosition);
        yPosition += 7;
      });
      
      yPosition += 20;
      
      // Congratulations and signature
      pdf.text("Congratulations on your achievement! We look forward to supporting your academic and sports journey.", margin, yPosition);
      yPosition += 20;
      
      pdf.text("Sincerely,", margin, yPosition);
      yPosition += 15;
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Prof. Rajendra Kumar", margin, yPosition);
      yPosition += 7;
      
      pdf.setFont("helvetica", "normal");
      pdf.text("Chairperson, EIL Scholarship Committee", margin, yPosition);
      yPosition += 7;
      pdf.text("Engineers India Limited", margin, yPosition);
      
      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 15;
      pdf.setFontSize(8);
      pdf.text(`This is a computer-generated document. No signature is required.`, pageWidth / 2, footerY - 5, { align: "center" });
      pdf.text(`Reference ID: ${refNumber}`, pageWidth / 2, footerY, { align: "center" });
      
      // EIL blue bar at bottom
      pdf.setFillColor(0, 83, 156);
      pdf.rect(0, pdf.internal.pageSize.getHeight() - 5, pageWidth, 5, 'F');
      
      // Save the PDF
      const fileName = `EIL_Scholarship_Approval_${application.applicationId || application._id.substring(0, 6)}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error("Error generating approval letter:", error);
      alert("Error generating approval letter. Please try again later.");
    } finally {
      setIsGeneratingApproval(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10" />
            Download Application Form
          </h1>
          <p className="text-lg text-muted-foreground">
            Fill in your details and download your application as a PDF
          </p>
        </div>

        {/* Application Status Notifications */}
        <div className="mb-8 max-w-3xl mx-auto">
          <ApplicationStatusNotification showAll={true} />
        </div>

        {/* Approved Applications Download Section */}
        <div className="mb-8 max-w-2xl mx-auto">
          <Card className={`bg-card ${approvedApplications.length > 0 ? "border-green-500 shadow-sm" : "border-primary/20"}`}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Approved Applications</CardTitle>
              <CardDescription className="text-base">
                Download official approval letters and certificates for your approved applications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6 pt-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : approvedApplications.length > 0 ? (
                <div className="space-y-4">
                  {approvedApplications.map(app => (
                    <div 
                      key={app._id} 
                      className="flex flex-col sm:flex-row justify-between items-center bg-green-50 rounded-lg p-4 border border-green-200"
                    >
                      <div className="text-left mb-3 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{app.applicationId || app._id.substring(0, 8)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Approved on {new Date(app.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        onClick={() => generateApprovalLetter(app)} 
                        disabled={isGeneratingApproval}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        {isGeneratingApproval ? "Generating..." : "Approval Letter"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You don't have any approved applications yet. When your application is approved, you'll be able to download official documents here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Download Section */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <DownloadIcon className="h-6 w-6" />
                Quick Download
              </CardTitle>
              <CardDescription className="text-base">
                Generate and download your application form instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 py-3 text-base"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                {isGenerating
                  ? "Generating PDF..."
                  : "Download Application PDF"}
              </Button>
              <p className="text-sm text-muted-foreground mt-6">
                Fill in the form below to include your details in the PDF
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-muted-foreground">
            Make sure to complete your application in the{" "}
            <a
              href="/apply"
              className="text-primary hover:underline font-medium"
            >
              Apply section
            </a>{" "}
            first. Your filled form data will be automatically included in the
            PDF download.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Download;
