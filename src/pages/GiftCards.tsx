import { useState } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, Image } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const giftCards = [
  {
    id: "GC-001",
    user: "Folake Adeyemi",
    userId: "USR-004",
    cardType: "Amazon",
    submittedValue: "$50",
    rate: "₦1,500/$1",
    calculatedAmount: "₦75,000",
    status: "pending",
    submittedAt: "Dec 31, 2024 14:20",
    imageUrl: "/placeholder.svg",
    code: null,
  },
  {
    id: "GC-002",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    cardType: "iTunes",
    submittedValue: "$100",
    rate: "₦1,400/$1",
    calculatedAmount: "₦140,000",
    status: "pending",
    submittedAt: "Dec 31, 2024 13:15",
    imageUrl: "/placeholder.svg",
    code: "ABCD-EFGH-IJKL",
  },
  {
    id: "GC-003",
    user: "Ngozi Obi",
    userId: "USR-006",
    cardType: "Steam",
    submittedValue: "$25",
    rate: "₦1,350/$1",
    calculatedAmount: "₦33,750",
    status: "approved",
    submittedAt: "Dec 31, 2024 11:00",
    reviewedBy: "Admin User",
    imageUrl: "/placeholder.svg",
    code: "STEAM-1234-5678",
  },
  {
    id: "GC-004",
    user: "Emeka Nwosu",
    userId: "USR-005",
    cardType: "Google Play",
    submittedValue: "$200",
    rate: "₦1,450/$1",
    calculatedAmount: "₦290,000",
    status: "rejected",
    submittedAt: "Dec 30, 2024 16:30",
    reviewedBy: "Admin User",
    rejectionReason: "Card already redeemed",
    imageUrl: "/placeholder.svg",
    code: null,
  },
  {
    id: "GC-005",
    user: "Amara Eze",
    userId: "USR-002",
    cardType: "Amazon",
    submittedValue: "$75",
    rate: "₦1,500/$1",
    calculatedAmount: "₦112,500",
    status: "approved",
    submittedAt: "Dec 30, 2024 14:00",
    reviewedBy: "Admin User",
    imageUrl: "/placeholder.svg",
    code: "AMZN-GIFT-7890",
  },
];

export default function GiftCards() {
  const [selectedCard, setSelectedCard] = useState<typeof giftCards[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const pendingCount = giftCards.filter(g => g.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Gift Cards</h1>
        <p className="page-description">
          Review and process gift card redemption requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Pending Review</p>
          <p className="metric-value mt-1">{pendingCount}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Approved Today</p>
          <p className="metric-value mt-1">18</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total Value Today</p>
          <p className="metric-value mt-1">₦1.2M</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Rejection Rate</p>
          <p className="metric-value mt-1">4.2%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by user or card ID..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="pending">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Card Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="itunes">iTunes</SelectItem>
            <SelectItem value="steam">Steam</SelectItem>
            <SelectItem value="google">Google Play</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Gift Cards Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Card ID</th>
              <th>User</th>
              <th>Card Type</th>
              <th>Value</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((card) => (
              <tr key={card.id}>
                <td className="font-medium">{card.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{card.user}</p>
                    <p className="text-xs text-muted-foreground">{card.userId}</p>
                  </div>
                </td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                    {card.cardType}
                  </span>
                </td>
                <td className="font-medium">{card.submittedValue}</td>
                <td className="text-muted-foreground">{card.rate}</td>
                <td className="font-medium">{card.calculatedAmount}</td>
                <td>
                  <StatusBadge
                    status={
                      card.status === "approved"
                        ? "success"
                        : card.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {card.status}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground">{card.submittedAt}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCard(card);
                        setSheetOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {card.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="text-success">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gift Card Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedCard && (
            <>
              <SheetHeader>
                <SheetTitle>Gift Card Review - {selectedCard.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Card Image */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Submitted Image
                  </h4>
                  <div className="rounded-lg border border-border bg-muted/50 aspect-video flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Card Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Card Type</p>
                      <p className="font-medium">{selectedCard.cardType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted Value</p>
                      <p className="font-medium">{selectedCard.submittedValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="font-medium">{selectedCard.rate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Calculated Amount</p>
                      <p className="font-medium">{selectedCard.calculatedAmount}</p>
                    </div>
                    {selectedCard.code && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Card Code</p>
                        <p className="font-mono font-medium bg-muted px-2 py-1 rounded">
                          {selectedCard.code}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    User
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedCard.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium">{selectedCard.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedCard.status === "pending" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Admin Notes
                    </h4>
                    <Textarea
                      placeholder="Add internal notes..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedCard.rejectionReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCard.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {selectedCard.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-success hover:bg-success/90">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
