/*
  Warnings:

  - You are about to drop the column `urlLogo` on the `CONGTY` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[CONGTY] DROP COLUMN [urlLogo];
ALTER TABLE [dbo].[CONGTY] ADD [logoUrl] VARCHAR(255),
[moTa] NVARCHAR(max);

-- AlterTable
ALTER TABLE [dbo].[MUAQUANGCAO] DROP CONSTRAINT [MUAQUANGCAO_trangThai_df];
ALTER TABLE [dbo].[MUAQUANGCAO] ADD CONSTRAINT [MUAQUANGCAO_trangThai_df] DEFAULT 'Chờ thanh toán' FOR [trangThai];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
