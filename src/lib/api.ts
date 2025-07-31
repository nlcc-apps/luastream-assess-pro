const API_BASE_URL = 'http://localhost:5000'; // Adjust to your C# API port

export interface StaffAppraisal {
  id: number;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  reviewPeriod: string;
  overallRating: number;
  goals: string;
  achievements: string;
  areasForImprovement: string;
  additionalComments: string;
  reviewDate: string;
  reviewerName: string;
  status: string;
}

export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  rating: string;
  lastReview: string;
  status: string;
}

export interface PerformanceReport {
  id: number;
  reportId: string;
  employeeName: string;
  reportContent: string;
  status: string;
  createdDate: string;
}

export interface PerformanceCalculation {
  id: number;
  employeeId: string;
  calculationType: string;
  result: number;
  parameters: string;
  createdDate: string;
}

export interface DashboardStats {
  totalAppraisals: number;
  averageOverallRating: number;
  totalEmployees: number;
  pendingReviews: number;
  onTimeCompletionRate: number;
  employeeSatisfaction: number;
}

export interface StaffProfile {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  emailNotificationsEnabled: boolean;
  reportCompletionNotification: boolean;
  weeklySummaryEnabled: boolean;
  autoSaveForms: boolean;
  dataBackupEnabled: boolean;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Staff Appraisals
  async getStaffAppraisals(): Promise<StaffAppraisal[]> {
    return this.request<StaffAppraisal[]>('/api/staff-appraisals');
  }

  async createStaffAppraisal(appraisal: Omit<StaffAppraisal, 'id'>): Promise<StaffAppraisal> {
    return this.request<StaffAppraisal>('/api/staff-appraisals', {
      method: 'POST',
      body: JSON.stringify(appraisal),
    });
  }

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/api/employees');
  }

  async getEmployee(id: number): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`);
  }

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    return this.request<Employee>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: number, employee: Employee): Promise<void> {
    await this.request(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  // Performance Reports
  async getPerformanceReports(): Promise<PerformanceReport[]> {
    return this.request<PerformanceReport[]>('/api/performance-reports');
  }

  async createPerformanceReport(report: Omit<PerformanceReport, 'id'>): Promise<PerformanceReport> {
    return this.request<PerformanceReport>('/api/performance-reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async downloadReport(id: number): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/performance-reports/${id}/download`);
    return response.blob();
  }

  // Performance Calculations
  async getPerformanceCalculations(): Promise<PerformanceCalculation[]> {
    return this.request<PerformanceCalculation[]>('/api/performance-calculations');
  }

  async createPerformanceCalculation(calculation: Omit<PerformanceCalculation, 'id'>): Promise<PerformanceCalculation> {
    return this.request<PerformanceCalculation>('/api/performance-calculations', {
      method: 'POST',
      body: JSON.stringify(calculation),
    });
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/dashboard/kpi-stats');
  }

  async getTeamPerformanceComparison(): Promise<any[]> {
    return this.request<any[]>('/api/dashboard/team-performance-comparison');
  }

  // Staff Profile
  async getStaffProfile(employeeId: string): Promise<StaffProfile> {
    return this.request<StaffProfile>(`/api/staff/profile/${employeeId}`);
  }

  async updateStaffProfile(profile: StaffProfile): Promise<void> {
    await this.request('/api/staff/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Export
  async exportEmployeesCSV(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/employees/export-csv`);
    return response.blob();
  }
}

export const api = new ApiService();