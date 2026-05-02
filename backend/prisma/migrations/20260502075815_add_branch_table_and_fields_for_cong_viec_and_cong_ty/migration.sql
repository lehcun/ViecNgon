/*
  Warnings:

  - You are about to drop the column `diaDiem` on the `CONGVIEC` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `CONGVIEC` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CONGVIEC` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CONGVIEC] DROP CONSTRAINT [CONGVIEC_maNTD_fkey];

-- AlterTable
ALTER TABLE [dbo].[CONGTY] ADD [aboutMe] NVARCHAR(max),
[chuyenMon] NVARCHAR(max),
[phucLoi] NVARCHAR(max);

-- AlterTable
ALTER TABLE [dbo].[CONGVIEC] DROP COLUMN [diaDiem];
ALTER TABLE [dbo].[CONGVIEC] ADD [hinhThucLamViec] NVARCHAR(50),
[maChiNhanh] VARCHAR(50),
[phucLoi] NVARCHAR(max),
[slug] VARCHAR(200) NOT NULL,
[thanhPho] NVARCHAR(100),
[yeuCauCongViec] NVARCHAR(max);

-- AlterTable
ALTER TABLE [dbo].[MUAQUANGCAO] DROP CONSTRAINT [MUAQUANGCAO_trangThai_df];
ALTER TABLE [dbo].[MUAQUANGCAO] ADD CONSTRAINT [MUAQUANGCAO_trangThai_df] DEFAULT 'Chờ thanh toán' FOR [trangThai];

-- CreateTable
CREATE TABLE [dbo].[CHINHANH] (
    [maChiNhanh] VARCHAR(50) NOT NULL,
    [thanhPho] NVARCHAR(100) NOT NULL,
    [diaChi] NVARCHAR(255) NOT NULL,
    [mapUrl] VARCHAR(500),
    [maCongTy] VARCHAR(50) NOT NULL,
    CONSTRAINT [CHINHANH_pkey] PRIMARY KEY CLUSTERED ([maChiNhanh])
);

-- CreateIndex
ALTER TABLE [dbo].[CONGVIEC] ADD CONSTRAINT [CONGVIEC_slug_key] UNIQUE NONCLUSTERED ([slug]);

-- AddForeignKey
ALTER TABLE [dbo].[CHINHANH] ADD CONSTRAINT [CHINHANH_maCongTy_fkey] FOREIGN KEY ([maCongTy]) REFERENCES [dbo].[CONGTY]([maCongTy]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CONGVIEC] ADD CONSTRAINT [CONGVIEC_maNTD_fkey] FOREIGN KEY ([maNTD]) REFERENCES [dbo].[NHATUYENDUNG]([maNTD]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CONGVIEC] ADD CONSTRAINT [CONGVIEC_maChiNhanh_fkey] FOREIGN KEY ([maChiNhanh]) REFERENCES [dbo].[CHINHANH]([maChiNhanh]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
