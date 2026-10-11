/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `TAIKHOAN` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[MUAQUANGCAO] DROP CONSTRAINT [MUAQUANGCAO_trangThai_df];
ALTER TABLE [dbo].[MUAQUANGCAO] ADD CONSTRAINT [MUAQUANGCAO_trangThai_df] DEFAULT 'Chờ thanh toán' FOR [trangThai];

-- AlterTable
ALTER TABLE [dbo].[TAIKHOAN] ALTER COLUMN [matKhau] VARCHAR(255) NULL;
ALTER TABLE [dbo].[TAIKHOAN] ADD [googleId] VARCHAR(255),
[provider] VARCHAR(20) NOT NULL CONSTRAINT [TAIKHOAN_provider_df] DEFAULT 'LOCAL';

-- CreateIndex
ALTER TABLE [dbo].[TAIKHOAN] ADD CONSTRAINT [TAIKHOAN_googleId_key] UNIQUE NONCLUSTERED ([googleId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
