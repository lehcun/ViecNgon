"use client";

import React, { useEffect, useState } from "react";
import type {
  AdminSkillItem,
  AdminSkillSortBy,
  AdminSkillUsageFilter,
} from "@viecngon/types";
import {
  useAdminSkills,
  useCreateAdminSkill,
  useDeleteAdminSkill,
  useMergeAdminSkill,
  useUpdateAdminSkill,
} from "@/hooks/admin/useAdminSkills";
import AdminSkillsTable from "@/components/admin/skills/AdminSkillsTable";
import AdminSkillModal, {
  type AdminSkillModalMode,
} from "@/components/admin/skills/AdminSkillModal";

export default function AdminSkillsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [usageFilter, setUsageFilter] = useState<AdminSkillUsageFilter>("ALL");
  const [sortBy, setSortBy] = useState<AdminSkillSortBy>("tenKyNang");
  const [page, setPage] = useState(1);

  const [modalState, setModalState] = useState<{
    mode: AdminSkillModalMode;
    skill: AdminSkillItem | null;
  } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const sortOrder = sortBy === "tenKyNang" ? "asc" : "desc";

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminSkills({
      q: debouncedSearch || undefined,
      usage: usageFilter,
      page,
      limit: 15,
      sortBy,
      sortOrder,
    });

  // Danh sách đầy đủ phục vụ dropdown chọn kỹ năng đích trong Modal Gộp
  const allSkillsQuery = useAdminSkills({
    limit: 100,
    sortBy: "tenKyNang",
    sortOrder: "asc",
  });

  const createMutation = useCreateAdminSkill();
  const updateMutation = useUpdateAdminSkill();
  const mergeMutation = useMergeAdminSkill();
  const deleteMutation = useDeleteAdminSkill();

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setUsageFilter("ALL");
    setSortBy("tenKyNang");
    setPage(1);
  };

  return (
    <div className="pb-8">
      <AdminSkillsTable
        items={data?.items ?? []}
        pagination={data?.pagination}
        summary={data?.summary}
        searchText={searchInput}
        usageFilter={usageFilter}
        sortBy={sortBy}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onSearchChange={(val) => {
          setSearchInput(val);
          setPage(1);
        }}
        onUsageFilterChange={(val) => {
          setUsageFilter(val);
          setPage(1);
        }}
        onSortByChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        onPageChange={setPage}
        onRetry={() => refetch()}
        onRequestCreate={() => setModalState({ mode: "create", skill: null })}
        onRequestEdit={(skill) => setModalState({ mode: "edit", skill })}
        onRequestMerge={(skill) => setModalState({ mode: "merge", skill })}
        onRequestDelete={(skill) => setModalState({ mode: "delete", skill })}
      />

      {modalState && (
        <AdminSkillModal
          key={`${modalState.mode}-${modalState.skill?.maKyNang ?? "new"}`}
          mode={modalState.mode}
          skill={modalState.skill}
          allSkills={allSkillsQuery.data?.items ?? data?.items ?? []}
          isSubmitting={
            createMutation.isPending ||
            updateMutation.isPending ||
            mergeMutation.isPending ||
            deleteMutation.isPending
          }
          onClose={() => setModalState(null)}
          onConfirmCreate={(tenKyNang) =>
            createMutation.mutate(
              { tenKyNang },
              { onSuccess: () => setModalState(null) },
            )
          }
          onConfirmEdit={(tenKyNang) => {
            if (!modalState.skill) return;
            updateMutation.mutate(
              { skillId: modalState.skill.maKyNang, payload: { tenKyNang } },
              { onSuccess: () => setModalState(null) },
            );
          }}
          onConfirmMerge={(targetSkillId) => {
            if (!modalState.skill) return;
            mergeMutation.mutate(
              {
                sourceSkillId: modalState.skill.maKyNang,
                payload: { targetSkillId },
              },
              { onSuccess: () => setModalState(null) },
            );
          }}
          onConfirmDelete={() => {
            if (!modalState.skill) return;
            deleteMutation.mutate(modalState.skill.maKyNang, {
              onSuccess: () => setModalState(null),
            });
          }}
        />
      )}
    </div>
  );
}
