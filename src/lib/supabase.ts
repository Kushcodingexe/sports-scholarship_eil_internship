import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = "https://your-project-ref.supabase.co";
const supabaseAnonKey = "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom DB interface
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  college: string;
  engineering_field: string;
  phone: string;
  created_at: string;
  updated_at: string;
}


export interface ApplicationData {
  id: string;
  user_id: string;
  title: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  mobile_number: string;
  email_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  national_id: string;
  highest_exam_passed: string;
  year_of_passing: string;
  school_university_name: string;
  institution_type: string;
  engineering_field: string;
  project_type: string;
  project_name: string;
  position_level: string;
  result_metrics: string;
  project_date: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}
