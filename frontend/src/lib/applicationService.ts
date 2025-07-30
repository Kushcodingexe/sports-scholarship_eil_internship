import { supabase } from "./supabase";
import type { ApplicationData } from "./supabase";

export class ApplicationService {
  // Save application data securely to database
  static async saveApplication(
    userId: string,
    formData: any,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const applicationData = {
        user_id: userId,
        title: formData.title,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        date_of_birth: formData.dateOfBirth,
        mobile_number: formData.mobileNumber,
        email_id: formData.emailId,
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        national_id: formData.nationalId,
        highest_exam_passed: formData.highestExamPassed,
        year_of_passing: formData.yearOfPassing,
        school_university_name: formData.schoolUniversityName,
        institution_type: formData.institutionType,
        engineering_field: formData.engineeringField,
        project_type: formData.projectType,
        project_name: formData.projectName,
        position_level: formData.positionLevel,
        result_metrics: formData.resultMetrics,
        project_date: formData.projectDate,
        status: "draft" as const,
      };

      const { data, error } = await supabase
        .from("applications")
        .upsert(applicationData)
        .select();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Also keep localStorage backup
      localStorage.setItem("eilApplicationData", JSON.stringify(formData));

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to save application",
      };
    }
  }

  // Get user's applications
  static async getUserApplications(userId: string): Promise<ApplicationData[]> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  }

  // Submit application for review
  static async submitApplication(
    applicationId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "submitted", updated_at: new Date().toISOString() })
        .eq("id", applicationId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to submit application",
      };
    }
  }
}
