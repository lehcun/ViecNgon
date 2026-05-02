/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CONGTY` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CONGTY` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[CONGTY] ADD [slug] VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[MUAQUANGCAO] DROP CONSTRAINT [MUAQUANGCAO_trangThai_df];
ALTER TABLE [dbo].[MUAQUANGCAO] ADD CONSTRAINT [MUAQUANGCAO_trangThai_df] DEFAULT 'Chờ thanh toán' FOR [trangThai];

-- CreateIndex
ALTER TABLE [dbo].[CONGTY] ADD CONSTRAINT [CONGTY_slug_key] UNIQUE NONCLUSTERED ([slug]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
