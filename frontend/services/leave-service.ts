
import { api } from "@/lib/api";

export interface LeaveRequest {
    id: number;
    employee_profile_id: number;
    employee_code?: string; // Employee code for display (e.g., "EMP001")
    employee_name?: string; // Optional, might need to be populated by joining data or returned from backend
    leave_type: "paid" | "sick" | "unpaid";
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: string;
    status: "pending" | "approved" | "rejected" | "cancelled";
    approver_id?: number;
    approved_at?: string;
    comments?: string;
    created_at?: string;
}

export interface LeaveBalance {
    id: number;
    employee_profile_id: number;
    leave_type: "paid" | "sick" | "unpaid";
    year: number;
    total_days: number;
    used_days: number;
    remaining_days: number;
}

export const leaveService = {
    // Employee: Apply for leave
    async applyForLeave(data: {
        employee_profile_id: number;
        leave_type: string;
        start_date: string;
        end_date: string;
        reason?: string;
        // total_days is now calculated by backend, no need to send
    }, token: string) {
        return await api.post("/leave/apply", data, token);
    },

    // Employee: Get my leave requests
    async getMyLeaves(token: string): Promise<LeaveRequest[]> {
        return await api.get("/leave/my-requests", token);
    },

    // Employee: Get balance
    async getMyBalance(token: string): Promise<LeaveBalance[]> {
        return await api.get("/leave/balance", token);
    },

    // Admin/HR: Get all leave requests
    async getAllLeaves(token: string): Promise<LeaveRequest[]> {
        return await api.get("/leave/all", token);
    },

    // Admin/HR: Get pending leave requests
    async getPendingLeaves(token: string): Promise<LeaveRequest[]> {
        return await api.get("/leave/pending", token);
    },

    // Admin/HR: Approve leave
    async approveLeave(leaveId: number, token: string) {
        return await api.put(`/leave/${leaveId}/approve`, {}, token);
    },

    // Admin/HR: Reject leave
    async rejectLeave(leaveId: number, comments: string, token: string) {
        return await api.put(`/leave/${leaveId}/reject`, { comments }, token);
    },

    // Employee: Cancel leave
    async cancelLeave(leaveId: number, token: string) {
        return await api.put(`/leave/${leaveId}/cancel`, {}, token);
    }
};
