"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { UserRole, PropertyStatus } from "@/types";
import { useProperties } from "@/features/tenants/hooks/propertyHooks";
import { useDeleteProperty } from "@/features/tenants/hooks/propertyHooks";
import { DataTable } from "@/components/tables/data-table";
import { SearchBar } from "@/components/inputs/search-bar";
import { StatusBadge } from "@/components/badges/status-badge";
import { AddPropertyModal } from "@/components/modals/add-property-modal";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function PropertiesPage() {
  const { user } = useAuth();

  const { data: properties = [] } = useProperties();
  const { mutate: deleteProperty } = useDeleteProperty();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(
    "all",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.PROPERTY_MANAGER;

  if (!user || (!isAdmin && !isManager)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  // role filtering (still client-side logic, OK)
  const accessibleProperties = isManager
    ? properties.filter((p) => p.managerId === user.id)
    : properties;

  const filteredProperties = accessibleProperties.filter(
    (property) =>
      (property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || property.status === statusFilter),
  );
console.log(filteredProperties)
  const columns = [
    { key: "name", label: "Property Name", className: "font-medium" },
    { key: "address", label: "Address" },
    {
      key: "type",
      label: "Type",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    { key: "units", label: "Units" },
    {
      key: "isActive",
      label: "isActive",
      render: (value: PropertyStatus) => <StatusBadge status={value?"active":"inactive"} />,
    },
    {
      key: "rentPerUnit",
      label: "Monthly Rent",
      render: (value?: number) =>
        typeof value === "number" ? ` ₹${value.toLocaleString()}` : "-",
    },
    {
      key: "id",
      label: "Actions",
      render: (id: string) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-secondary rounded">
            <Eye className="h-4 w-4" />
          </button>

          <button className="p-1 hover:bg-secondary rounded">
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={() => deleteProperty(id)}
            className="p-1 hover:bg-destructive/10 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // derived stats (NOT hardcoded, fully dynamic)
  const totalUnits = accessibleProperties.reduce((sum, p) => sum + p.units, 0);

  const totalRevenue = accessibleProperties.reduce(
    (sum, p) => sum + p.rentAmount * p.units,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage all properties and their details
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search properties..."
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as PropertyStatus | "all")
          }
        >
          <option value="all">All Status</option>
          <option value={PropertyStatus.ACTIVE}>Active</option>
          <option value={PropertyStatus.INACTIVE}>Inactive</option>
          <option value={PropertyStatus.MAINTENANCE}>Maintenance</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <p>Total Properties</p>
          <p className="text-2xl font-bold">{accessibleProperties.length}</p>
        </div>

        <div className="p-4 border rounded">
          <p>Total Units</p>
          <p className="text-2xl font-bold">{totalUnits}</p>
        </div>

        <div className="p-4 border rounded">
          <p>Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredProperties}
        columns={columns}
        itemsPerPage={10}
      />

      {/* Modal */}
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

