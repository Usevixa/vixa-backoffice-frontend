import { useState, useEffect, useMemo } from "react";
import { Search, ShieldCheck, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { KycDetail } from "@/types/kyc";
import { KycDetailsSheet } from "@/components/kyc/KycDetailsSheet";

// ─── Status helpers ────────────────────────────────────────────────────────

function statusVariant(status: string): "success" | "warning" | "error" | "neutral" {
  const s = status.toLowerCase();
  if (s === "verified") return "success";
  if (["pending", "pending_approval", "under_review"].includes(s)) return "warning";
  if (["failed", "rejected"].includes(s)) return "error";
  return "neutral";
}

// ─── Mock data ─────────────────────────────────────────────────────────────
// TODO: Remove once API endpoints are available.
// Replace MOCK_STATS with:  const { data: stats } = useKycStats()
// Replace MOCK_RECORDS + client filtering with:
//   const { data, isLoading, isError } = useKycRecords({ Search: search, Status: status,
//     DateFrom: dateFrom, DateTo: dateTo, PageNo: currentPage, PageSize: pageSize })
//   const records = data?.items ?? []
//   const totalCount = data?.totalCount ?? 0
//   const totalPages = data?.totalPages ?? 1

const MOCK_STATS = {
  totalCount: 15,
  verifiedCount: 4,
  pendingCount: 3,
  pendingApprovalCount: 4,
  failedCount: 3,
};

const MOCK_RECORDS: KycDetail[] = [
  {
    id: 1,
    userId: "USR-7A2F8C01",
    userFullName: "Adewale Osinachi",
    email: "adewale.osinachi@email.com",
    phone: "+2348031234567",
    dateOfBirth: "1990-04-15",
    status: "verified",
    statusDisplay: "Verified",
    submittedAt: "2024-11-12T10:30:00Z",
    updatedAt: "2024-11-14T09:15:00Z",
    reviewerName: "Admin Olu",
    documentType: "National ID",
    documentNumber: "NIN-12345678901",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "14 Broad Street, Lagos Island, Lagos",
    reviewedAt: "2024-11-14T09:15:00Z",
    reviewComment: "All documents verified and matched.",
    reviewHistory: [
      {
        id: 1,
        action: "approved",
        actionDisplay: "Approved",
        comment: "All documents verified and matched.",
        reviewerName: "Admin Olu",
        timestamp: "2024-11-14T09:15:00Z",
      },
    ],
  },
  {
    id: 2,
    userId: "USR-4B9D3E02",
    userFullName: "Funmilayo Adeyemi",
    email: "funmi.adeyemi@email.com",
    phone: "+2348057891234",
    dateOfBirth: "1994-07-22",
    status: "pending_approval",
    statusDisplay: "Pending Approval",
    submittedAt: "2025-01-08T14:20:00Z",
    updatedAt: "2025-01-08T14:20:00Z",
    reviewerName: null,
    documentType: "International Passport",
    documentNumber: "A12345678",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "7 Awolowo Road, Ikoyi, Lagos",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 3,
    userId: "USR-2C6F5A03",
    userFullName: "Chukwuemeka Okafor",
    email: "emeka.okafor@email.com",
    phone: "+2348094567890",
    dateOfBirth: "1988-12-03",
    status: "pending",
    statusDisplay: "Pending",
    submittedAt: "2025-01-10T09:45:00Z",
    updatedAt: "2025-01-10T09:45:00Z",
    reviewerName: null,
    documentType: "Driver's License",
    documentNumber: "DL-ABJ-2019-004821",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "22 Nnamdi Azikiwe Street, Onitsha, Anambra",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 4,
    userId: "USR-8E1B7D04",
    userFullName: "Ngozi Eze",
    email: "ngozi.eze@email.com",
    phone: "+2348012345678",
    dateOfBirth: "1992-03-18",
    status: "verified",
    statusDisplay: "Verified",
    submittedAt: "2024-10-05T11:10:00Z",
    updatedAt: "2024-10-07T16:30:00Z",
    reviewerName: "Admin Tunde",
    documentType: "National ID",
    documentNumber: "NIN-98765432109",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "5 Enugu Road, Enugu",
    reviewedAt: "2024-10-07T16:30:00Z",
    reviewComment: "Identity confirmed. No discrepancies.",
    reviewHistory: [
      {
        id: 4,
        action: "approved",
        actionDisplay: "Approved",
        comment: "Identity confirmed. No discrepancies.",
        reviewerName: "Admin Tunde",
        timestamp: "2024-10-07T16:30:00Z",
      },
    ],
  },
  {
    id: 5,
    userId: "USR-3D4C9F05",
    userFullName: "Babatunde Fashola",
    email: "babatunde.fashola@email.com",
    phone: "+2348065432109",
    dateOfBirth: "1986-09-11",
    status: "failed",
    statusDisplay: "Failed",
    submittedAt: "2024-12-20T08:00:00Z",
    updatedAt: "2024-12-21T12:45:00Z",
    reviewerName: "Admin Olu",
    documentType: "International Passport",
    documentNumber: "B98765432",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "10 Herbert Macaulay Way, Yaba, Lagos",
    reviewedAt: "2024-12-21T12:45:00Z",
    reviewComment: "Document image quality too low. Blurry scan.",
    reviewHistory: [
      {
        id: 5,
        action: "declined",
        actionDisplay: "Declined",
        comment: "Document image quality too low. Blurry scan.",
        reviewerName: "Admin Olu",
        timestamp: "2024-12-21T12:45:00Z",
      },
    ],
  },
  {
    id: 6,
    userId: "USR-9A5E2C06",
    userFullName: "Adaeze Okonkwo",
    email: "adaeze.okonkwo@email.com",
    phone: "+2348078901234",
    dateOfBirth: "1996-01-25",
    status: "pending_approval",
    statusDisplay: "Pending Approval",
    submittedAt: "2025-01-14T16:05:00Z",
    updatedAt: "2025-01-14T16:05:00Z",
    reviewerName: null,
    documentType: "National ID",
    documentNumber: "NIN-44556677889",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "3 Owerri Road, Aba, Abia",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 7,
    userId: "USR-1F8A6B07",
    userFullName: "Olusegun Abiodun",
    email: "olusegun.abiodun@email.com",
    phone: "+2348041237890",
    dateOfBirth: "1983-06-30",
    status: "verified",
    statusDisplay: "Verified",
    submittedAt: "2024-09-18T13:00:00Z",
    updatedAt: "2024-09-20T10:00:00Z",
    reviewerName: "Admin Tunde",
    documentType: "Voter's Card",
    documentNumber: "VC-OG-001-2019-234567",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "45 Awolowo Avenue, Abeokuta, Ogun",
    reviewedAt: "2024-09-20T10:00:00Z",
    reviewComment: "Voter's card verified. Photo match confirmed.",
    reviewHistory: [
      {
        id: 7,
        action: "approved",
        actionDisplay: "Approved",
        comment: "Voter's card verified. Photo match confirmed.",
        reviewerName: "Admin Tunde",
        timestamp: "2024-09-20T10:00:00Z",
      },
    ],
  },
  {
    id: 8,
    userId: "USR-5G7H3I08",
    userFullName: "Chinonso Nwachukwu",
    email: "chinonso.nwachukwu@email.com",
    phone: "+2348023456789",
    dateOfBirth: "1999-11-07",
    status: "pending",
    statusDisplay: "Pending",
    submittedAt: "2025-01-15T11:30:00Z",
    updatedAt: "2025-01-15T11:30:00Z",
    reviewerName: null,
    documentType: "National ID",
    documentNumber: "NIN-22334455667",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "17 Trans-Ekulu, Enugu",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 9,
    userId: "USR-6J2K4L09",
    userFullName: "Taiwo Adeleke",
    email: "taiwo.adeleke@email.com",
    phone: "+2348089012345",
    dateOfBirth: "1991-08-14",
    status: "rejected",
    statusDisplay: "Rejected",
    submittedAt: "2024-11-28T07:30:00Z",
    updatedAt: "2024-11-30T14:00:00Z",
    reviewerName: "Admin Olu",
    documentType: "International Passport",
    documentNumber: "C11223344",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "2 Osogbo Road, Osun",
    reviewedAt: "2024-11-30T14:00:00Z",
    reviewComment: "Documents do not match submitted data. Name mismatch detected.",
    reviewHistory: [
      {
        id: 9,
        action: "declined",
        actionDisplay: "Declined",
        comment: "Documents do not match submitted data. Name mismatch detected.",
        reviewerName: "Admin Olu",
        timestamp: "2024-11-30T14:00:00Z",
      },
    ],
  },
  {
    id: 10,
    userId: "USR-0M8N1O10",
    userFullName: "Uchenna Obiora",
    email: "uchenna.obiora@email.com",
    phone: "+2348036789012",
    dateOfBirth: "1995-02-19",
    status: "pending_approval",
    statusDisplay: "Pending Approval",
    submittedAt: "2025-01-16T09:00:00Z",
    updatedAt: "2025-01-16T09:00:00Z",
    reviewerName: null,
    documentType: "Driver's License",
    documentNumber: "DL-EN-2020-007654",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "88 Ogui Road, Enugu",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 11,
    userId: "USR-4P5Q6R11",
    userFullName: "Abimbola Coker",
    email: "abimbola.coker@email.com",
    phone: "+2348015678901",
    dateOfBirth: "1993-05-09",
    status: "not_started",
    statusDisplay: "Not Started",
    submittedAt: null,
    updatedAt: null,
    reviewerName: null,
    documentType: null,
    documentNumber: null,
    issuingCountry: null,
    nationality: null,
    address: null,
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 12,
    userId: "USR-7S8T9U12",
    userFullName: "Chioma Nwosu",
    email: "chioma.nwosu@email.com",
    phone: "+2348052345678",
    dateOfBirth: "1997-10-01",
    status: "pending",
    statusDisplay: "Pending",
    submittedAt: "2025-01-17T15:20:00Z",
    updatedAt: "2025-01-17T15:20:00Z",
    reviewerName: null,
    documentType: "National ID",
    documentNumber: "NIN-55667788990",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "6 Zaria Road, Kano",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 13,
    userId: "USR-2V3W4X13",
    userFullName: "Kehinde Ogunleye",
    email: "kehinde.ogunleye@email.com",
    phone: "+2348069012345",
    dateOfBirth: "1989-03-27",
    status: "verified",
    statusDisplay: "Verified",
    submittedAt: "2024-08-22T10:00:00Z",
    updatedAt: "2024-08-24T11:30:00Z",
    reviewerName: "Admin Tunde",
    documentType: "National ID",
    documentNumber: "NIN-66778899001",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "33 Toyin Street, Ikeja, Lagos",
    reviewedAt: "2024-08-24T11:30:00Z",
    reviewComment: "All clear. Documents authentic.",
    reviewHistory: [
      {
        id: 13,
        action: "approved",
        actionDisplay: "Approved",
        comment: "All clear. Documents authentic.",
        reviewerName: "Admin Tunde",
        timestamp: "2024-08-24T11:30:00Z",
      },
    ],
  },
  {
    id: 14,
    userId: "USR-5Y6Z7A14",
    userFullName: "Emeka Eze",
    email: "emeka.eze@email.com",
    phone: "+2348090123456",
    dateOfBirth: "1987-07-04",
    status: "pending_approval",
    statusDisplay: "Pending Approval",
    submittedAt: "2025-01-18T12:00:00Z",
    updatedAt: "2025-01-18T12:00:00Z",
    reviewerName: null,
    documentType: "International Passport",
    documentNumber: "D44556677",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "12 Awka Road, Onitsha, Anambra",
    reviewedAt: null,
    reviewComment: null,
    reviewHistory: [],
  },
  {
    id: 15,
    userId: "USR-8B9C0D15",
    userFullName: "Oluwaseun Balogun",
    email: "oluwaseun.balogun@email.com",
    phone: "+2348047890123",
    dateOfBirth: "1985-12-16",
    status: "failed",
    statusDisplay: "Failed",
    submittedAt: "2024-12-10T08:15:00Z",
    updatedAt: "2024-12-12T13:00:00Z",
    reviewerName: "Admin Olu",
    documentType: "Driver's License",
    documentNumber: "DL-LA-2015-003214",
    issuingCountry: "Nigeria",
    nationality: "Nigerian",
    address: "9 Agege Motor Road, Ogba, Lagos",
    reviewedAt: "2024-12-12T13:00:00Z",
    reviewComment: "Expired document submitted. Driver's license validity ended 2023.",
    reviewHistory: [
      {
        id: 15,
        action: "declined",
        actionDisplay: "Declined",
        comment: "Expired document submitted. Driver's license validity ended 2023.",
        reviewerName: "Admin Olu",
        timestamp: "2024-12-12T13:00:00Z",
      },
    ],
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

const pageSize = 15;

export default function Kyc() {
  const [selectedRecord, setSelectedRecord] = useState<KycDetail | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Debounce search — 400ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, dateFrom, dateTo]);

  // TODO: Replace with API hooks when endpoints are available:
  // const { data, isLoading, isError } = useKycRecords({ Search: search, Status: status,
  //   DateFrom: dateFrom || undefined, DateTo: dateTo || undefined,
  //   PageNo: currentPage, PageSize: pageSize })
  // const { data: stats } = useKycStats()
  // const records = data?.items ?? []
  // const totalCount = data?.totalCount ?? 0
  // const totalPages = data?.totalPages ?? 1
  const isLoading = false;
  const isError = false;

  const filteredRecords = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_RECORDS.filter((r) => {
      const matchesSearch =
        !q ||
        r.userFullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q);
      const matchesStatus = status === "all" || r.status === status;
      const submittedDate = r.submittedAt ? r.submittedAt.slice(0, 10) : null;
      const matchesFrom = !dateFrom || (submittedDate && submittedDate >= dateFrom);
      const matchesTo = !dateTo || (submittedDate && submittedDate <= dateTo);
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [search, status, dateFrom, dateTo]);

  const totalCount = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const records = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const stats = MOCK_STATS;

  const hasActiveFilters =
    !!searchInput || status !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">KYC</h1>
          <p className="page-description">
            Identity verification records — review, approve, and manage user KYC submissions
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          KYC · Identity Verification
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Total Users</p>
          </div>
          <p className="metric-value mt-1">{stats.totalCount}</p>
        </div>
        <div className="metric-card border-success/30">
          <p className="metric-label">Verified</p>
          <p className="metric-value mt-1 text-success">{stats.verifiedCount}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending</p>
          <p className="metric-value mt-1 text-warning">{stats.pendingCount}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending Approval</p>
          <p className="metric-value mt-1 text-warning">{stats.pendingApprovalCount}</p>
          {stats.pendingApprovalCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          )}
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed / Rejected</p>
          <p className="metric-value mt-1 text-destructive">{stats.failedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Date range row */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">From</span>
          <Input
            type="date"
            className="w-40"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">To</span>
          <Input
            type="date"
            className="w-40"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
        {/* Other filters row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name, email, phone..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>KYC Status</th>
              <th>Submitted</th>
              <th>Last Updated</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  Loading...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-destructive">
                  Failed to load KYC records. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && records.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No KYC records found.
                </td>
              </tr>
            )}
            {records.map((record) => (
              <tr
                key={record.id}
                className={cn(
                  "cursor-pointer",
                  statusVariant(record.status) === "error" && "bg-destructive/5"
                )}
                onClick={() => {
                  setSelectedRecord(record);
                  setSheetOpen(true);
                }}
              >
                <td>
                  <p className="font-medium text-sm">{record.userFullName}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {record.userId}
                  </p>
                </td>
                <td className="text-sm text-muted-foreground">{record.email}</td>
                <td className="text-sm text-muted-foreground">{record.phone}</td>
                <td className="text-sm text-muted-foreground">
                  {record.dateOfBirth
                    ? new Date(record.dateOfBirth).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td>
                  <StatusBadge status={statusVariant(record.status)}>
                    {record.statusDisplay}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground text-sm">
                  {record.submittedAt
                    ? new Date(record.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="text-muted-foreground text-sm">
                  {record.updatedAt
                    ? new Date(record.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedRecord(record);
                      setSheetOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {totalCount === 0
            ? "0"
            : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                currentPage * pageSize,
                totalCount
              )}`}{" "}
          of {totalCount}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(p)}
              className="w-8 px-0"
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <KycDetailsSheet
        record={selectedRecord}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
